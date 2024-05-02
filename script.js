function search(event) {
    if (event.key === "Enter") {
        var input = document.getElementById("searchInput").value.trim().toLowerCase();
        if (input !== "") {
            var resultList = document.getElementById("searchResults");
            resultList.innerHTML = '';

            // Dodajemy wprowadzone przez użytkownika zapytanie jako argument do URL-a
            var url = new URL(window.location.href);
            url.searchParams.set('q', input);
            history.pushState({}, '', url);

            fetchResults(input, resultList);
        }
    }
}

// Funkcja do pobierania wyników z pliku urls.txt
function fetchResults(input, resultList) {
    fetch('urls.txt')
    .then(response => response.text())
    .then(data => {
        var lines = data.split('\n');
        var found = false; // Flaga wskazująca, czy znaleziono wynik
        lines.forEach(function(line) {
            if (line.toLowerCase().includes(input)) {
                found = true; // Ustaw flagę na true, jeśli znaleziono wynik
                var url = line.trim();
                var listItem = document.createElement("li");
                var link = document.createElement("a");
                
                // Sprawdź, czy znaleziony wynik jest adresem URL
                if (!/^https?:\/\//i.test(url)) {
                    // Jeśli nie, dodaj prefiks "http://" przed tworzeniem hiperłąza
                    url = "http://" + url;
                }
                
                link.href = url;
                link.textContent = line;
                listItem.appendChild(link);
                resultList.appendChild(listItem);
            }
        });

        if (!found) {
            // Jeśli nie znaleziono wyniku, wyświetl komunikat
            resultList.innerHTML = '<li class="no-results">Ups, coś nie poszło zgodnie z naszym planem (lub twoim)</li>';
        }
    })
    .catch(error => console.error('Error:', error));
}

// Funkcja do pobierania wyników z URL-a przy wczytywaniu strony
window.onload = function() {
    var urlParams = new URLSearchParams(window.location.search);
    var query = urlParams.get('q');
    if (query) {
        document.getElementById("searchInput").value = query;
        var resultList = document.getElementById("searchResults");
        fetchResults(query, resultList);
    }
};
