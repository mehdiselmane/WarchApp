document.addEventListener("DOMContentLoaded", function () {
    const versesContainer = document.getElementById("verses");
    const prevButton = document.getElementById("prev");
    const nextButton = document.getElementById("next");
    const searchInput = document.getElementById("search-bar");
    const tableBody = document.querySelector("#results-table tbody");


    const surahsToStartNewPage = [ "سُورَةُ البقرة","سُورَةُ ءَالِ عِمْرَانَ","سُورَةُ اُ۬لْمَآئِدَةِ","سُورَةُ اُ۬لتَّوْبَةِ","سُورَةُ يُونُسَ","سُورَةُ اُ۬لرَّعْدِ","سُورَةُ إِبْرَاهِيمَ","سُورَةُ اُ۬لْحَجِّ","سُورَةُ اُ۬لنُّورِ","سُورَةُ اُ۬لرُّومِ","سُورَةُ اُ۬لَاحْزَابِ","سُورَةُ اُ۬لدُّخَانِ","سُورَةُ اُ۬لَاحْقَافِ","سُورَةُ اُ۬لْحَشْرِ","سُورَةُ اُ۬لْمُمْتَحنَةِ","سُورَةُ اُ۬لْجُمُعَةِ","سُورَةُ اُ۬لتَّحْرِيمِ","سُورَةُ اُ۬لنَّبَإِ","سُورَةُ اُ۬لَاعْلَي","سُورَةُ اُ۬لْغَٰشِيَةِ","سُورَةُ اُ۬لْفَجْرِ","سُورَةُ اُ۬لشَّمْسِ","سُورَةُ اُ۬لْبَيِّنَةِ","سُورَةُ اُ۬لْكَوْثَرِ","سُورَةُ اُ۬لْمَسَدِ","سُورَةُ اُ۬لنَّاسِ","سُورَةُ اُ۬لْمُلْكِ","سُورَةُ اُ۬لْجِنِّ","سُورَةُ اُ۬لْمُزَّمِّلِ","سُورَةُ عَبَسَ","سُورَةُ اُ۬لِانفِطَارِ","سُورَةُ اُ۬لْمُطَفِّفِينَ","سُورَةُ اُ۬لطَّارِقِ","سُورَةُ اُ۬ليْلِ","سُورَةُ اُ۬لشَّرْحِ","سُورَةُ اُ۬لْعَلَقِ","سُورَةُ اُ۬لْعَٰدِيَٰتِ","سُورَةُ اُ۬لْتَّكَاثُرِ","سُورَةُ اُ۬لْهُمَزَةِ","سُورَةُ قُرَيْشٍ"]; // Add Surah names here

    let currentPage = 0;

    let pages = [];

    function renderVerses(highlightTerm = "") {
        let wordCount = 0;
        pages = [[]];
    
        verses.forEach((verse) => {
            if (verse.startsWith("سُورَةُ")) {
                // If the Surah is in the list, start a new page
                if (surahsToStartNewPage.includes(verse.trim())) {
                    pages.push([]);
                    wordCount = 0;
                }
                // Add the Surah to the current page
                pages[pages.length - 1].push(verse);
            } else if (verse.trim() === "بِسْمِ اِ۬للَّهِ اِ۬لرَّحْمَٰنِ اِ۬لرَّحِيمِ") {
                // Add Basmala to the current page
                pages[pages.length - 1].push(verse);
            } else {
                const wordLength = verse.split(/\s+/).length; // Count words in the verse
                if (wordCount + wordLength <= 160) {
                    pages[pages.length - 1].push(verse);
                    wordCount += wordLength;
                } else {
                    pages.push([verse]);
                    wordCount = wordLength;
                }
            }
        });
    
        // Remove empty pages if any
        pages = pages.filter(page => page.length > 0);
    
        const currentPageContent = pages[currentPage];
        if (currentPageContent) {
            const combinedContent = currentPageContent
                .map(verse => {
                    // Display Surah names or Basmala in separate paragraphs
                    if (verse.startsWith("سُورَةُ")) {
                        return `<p class="SurahName">${highlightArabic(highlightTerm, verse)}</p>`;
                    }
                    if (verse.trim() === "بِسْمِ اِ۬للَّهِ اِ۬لرَّحْمَٰنِ اِ۬لرَّحِيمِ") {
                        return `<p class="Basmala">${highlightArabic(highlightTerm, verse)}</p>`;
                    }
                    return highlightArabic(highlightTerm, verse);
                })
                .join(" ");
    
            versesContainer.innerHTML = `<div class="combined-paragraph">${combinedContent}</div>`;
        } else {
            versesContainer.innerHTML = "No content available.";
        }
    
        prevButton.disabled = currentPage === 0;
        nextButton.disabled = currentPage === pages.length - 1;
    }
        
    function scrollToVerse(verse) {
        // Find the page containing the verse
        let foundPage = -1;
        pages.forEach((page, index) => {
            if (page.some((v) => v.includes(verse))) {
                foundPage = index;
            }
        });

        if (foundPage !== -1) {
            // Switch to the correct page
            currentPage = foundPage;
            renderVerses(searchInput.value.trim());

            // Scroll to the verse within the combined content
            const combinedContent = pages[currentPage].join(" ");
            const highlightedContent = highlightArabic(searchInput.value.trim(), combinedContent);
            versesContainer.innerHTML = `<div class="combined-paragraph">${highlightedContent}</div>`;

            const verseIndex = pages[currentPage].findIndex((v) => v.includes(verse));
            if (verseIndex !== -1) {
                const highlightedElements = document.querySelectorAll(".highlighted");
                if (highlightedElements.length > 0) {
                    highlightedElements[0].scrollIntoView({ behavior: "smooth", block: "center" });
                }
            }
        } else {
            console.warn("Verse not found on any page.");
        }
    }

    function searchVerses(term) {
        const normalizedTerm = removeDiacritics(term);
        return verses.filter((verse) => {
            const normalizedVerse = removeDiacritics(verse);
            return normalizedVerse.includes(normalizedTerm);
        });
    }

    function displaySearchResults(results, highlightTerm) {
        tableBody.innerHTML = "";

        results.forEach((result, index) => {
            const resultIndex = verses.indexOf(result);
            const closestSura = findClosestSura(resultIndex);
            const lastNumber = extractLastNumber(result);

            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${highlightArabic(highlightTerm, result)}</td>
                <td>${lastNumber}</td>
                <td>${closestSura}</td>
            `;

            row.onclick = function () {
                scrollToVerse(result);
            };

            tableBody.appendChild(row);
        });
    }

    function extractLastNumber(text) {
        const normalizedText = text.replace(/[\u0660-\u0669]/g, (c) => c.charCodeAt(0) - 0x0660);
        const match = normalizedText.match(/\d+/g);
        return match ? match[match.length - 1] : "N/A";
    }

    function findClosestSura(index) {
        for (let i = index; i >= 0; i--) {
            if (verses[i].startsWith("سُورَةُ")) {
                return verses[i];
            }
        }
        return "N/A";
    }

    searchInput.addEventListener("input", function () {
        const searchTerm = searchInput.value.trim();
        if (searchTerm.length >= 3) {
            const results = searchVerses(searchTerm);
            displaySearchResults(results, searchTerm);
            renderVerses(searchTerm);
        } else {
            tableBody.innerHTML = "";
            renderVerses();
        }
    });

    prevButton.addEventListener("click", function () {
        if (currentPage > 0) currentPage--;
        renderVerses(searchInput.value.trim());
    });

    nextButton.addEventListener("click", function () {
        if (currentPage < pages.length - 1) currentPage++;
        renderVerses(searchInput.value.trim());
    });

    renderVerses();
});

function removeDiacritics(text) {
    return text
        .replace(/[^\u06D2\u0670\u0621-\u063A\u0641-\u064A\u0660-\u0669\s]/g, "")
        .replace(/(ے|يٰ|ى|[ٰا]|وٰ)/g, function (m) {
            switch (m) {
                case "ے":
                case "يٰ":
                case "ى":
                    return "ي";
                case "ٰ":
                case "ا":
                case "وٰ":
                    return "ا";
                default:
                    return m;
            }
        });
}

function highlightArabic(search, text, verbose = false) {
    if (!search || !text) {
        return text;
    }

    const normalizedSearch = search
        .replace(/ا/g, "[وٰاٰ]")
        .replace(/ي/g, "[يے]")
        .replace(/(يٰ|ى)/g, "ي");

    const searchRegex = new RegExp(
        normalizedSearch.split(/\s+/).map((word) =>
            word.replace(/./g, "($&)\\p{M}*")).join("\\s*"),
        "giu"
    );

    const highlightedText = text.replace(
        searchRegex,
        (match) => `<span class="highlighted">${match}</span>`
    );

    if (verbose) {
        console.log("Normalized Search:", normalizedSearch);
        console.log("Search Regex:", searchRegex);
        console.log("Highlighted Text:", highlightedText);
    }

    return highlightedText;
}
