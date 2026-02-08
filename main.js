// =========================
// Readify - Main JS
// =========================

// Reusable helper (we’ll reuse this later on other pages too)
function $(selector) {
    return document.querySelector(selector);
}

// Mobile menu toggle
document.addEventListener("DOMContentLoaded", () => {
    const hamburger = $(".hamburger");
    const navLinks = $(".nav-links");

    if (hamburger && navLinks) {
        hamburger.addEventListener("click", () => {
            navLinks.classList.toggle("show");
        });
    }
});

// Highlight active nav link based on current page
document.addEventListener("DOMContentLoaded", () => {
    const current = window.location.pathname.split("/").pop() || "index.html";

    document.querySelectorAll(".nav-links a").forEach(a => {
        const href = a.getAttribute("href");
        if (href === current) a.classList.add("active");
    });
});

// =========================
// Book Data (JSON-like JS object)
// =========================
const BOOKS = [
  {
    id: "dune",
    title: "Dune",
    author: "Frank Herbert",
    genre: "Sci-Fi",
    image: "assets/images/dune.jpg",
    synopsis: "A sweeping sci-fi epic of politics, prophecy, and survival on the desert planet Arrakis.",
    series: ["Dune Messiah", "Children of Dune"],
    ratings: [
      { source: "Readers", rating: "4.6/5", comment: "Big ideas, bigger sandworms." },
      { source: "Critics", rating: "4.4/5", comment: "A genre-defining classic." }
    ]
  },
  {
    id: "hobbit",
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    genre: "Fantasy",
    image: "assets/images/hobbit.jpg",
    synopsis: "Bilbo Baggins is swept into an adventure with dwarves, riddles, and a very unwanted ring.",
    series: ["The Fellowship of the Ring", "The Two Towers", "The Return of the King"],
    ratings: [
      { source: "Readers", rating: "4.8/5", comment: "Cozy adventure energy." },
      { source: "Teachers", rating: "4.5/5", comment: "Great gateway to fantasy." }
    ]
  },
  {
    id: "gatsby",
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    genre: "Classic",
    image: "assets/images/the-great-gatsby.jpg",
    synopsis: "Wealth, longing, and illusion collide in the Jazz Age, told through Nick Carraway’s eyes.",
    series: [],
    ratings: [
      { source: "Readers", rating: "4.1/5", comment: "Short, sharp, tragic." },
      { source: "Critics", rating: "4.6/5", comment: "A precise American mirror." }
    ]
  }
];

// =========================
// Explorer Page Logic
// =========================
document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("bookGrid");
  const searchInput = document.getElementById("searchInput");
  const genreFilter = document.getElementById("genreFilter");

  // Run ONLY on explore.html
  if (!grid || !searchInput || !genreFilter) return;

  // Populate genre dropdown
  const genres = Array.from(new Set(BOOKS.map(b => b.genre))).sort();
  genres.forEach(g => {
    const opt = document.createElement("option");
    opt.value = g;
    opt.textContent = g;
    genreFilter.appendChild(opt);
  });

  function renderBooks(list) {
    grid.innerHTML = "";
    if (list.length === 0) {
      grid.innerHTML = `<p class="muted">No books found. Try a different search.</p>`;
      return;
    }

    list.forEach(book => {
      const card = document.createElement("article");
      card.className = "card";
      card.innerHTML = `
        <div class="card-img" style="background-image: url('${book.image}');" aria-hidden="true"></div>
        <div class="card-body">
          <div class="card-title">${book.title}</div>
          <div class="card-meta">${book.author} • ${book.genre}</div>
        </div>
      `;
      card.addEventListener("click", () => openModal(book));
      grid.appendChild(card);
    });
  }

  function getFilteredBooks() {
    const q = searchInput.value.trim().toLowerCase();
    const genre = genreFilter.value;

    return BOOKS.filter(b => {
      const matchesText =
        b.title.toLowerCase().includes(q) ||
        b.author.toLowerCase().includes(q);

      const matchesGenre = genre === "all" ? true : b.genre === genre;

      return matchesText && matchesGenre;
    });
  }

  // Modal wiring
  const modal = document.getElementById("bookModal");
  const closeBtn = document.getElementById("closeModal");

  function openModal(book) {
    document.getElementById("modalTitle").textContent = `${book.title} — ${book.author}`;
    document.getElementById("modalSynopsis").textContent = book.synopsis;

    const seriesList = document.getElementById("modalSeries");
    seriesList.innerHTML = "";
    if (book.series.length === 0) {
      const li = document.createElement("li");
      li.className = "muted";
      li.textContent = "No prequels/sequels listed.";
      seriesList.appendChild(li);
    } else {
      book.series.forEach(item => {
        const li = document.createElement("li");
        li.textContent = item;
        seriesList.appendChild(li);
      });
    }

    const ratingsBody = document.getElementById("modalRatings");
    ratingsBody.innerHTML = "";
    book.ratings.forEach(r => {
      const tr = document.createElement("tr");
      tr.innerHTML = `<td>${r.source}</td><td>${r.rating}</td><td>${r.comment}</td>`;
      ratingsBody.appendChild(tr);
    });

    modal.classList.add("show");
    modal.setAttribute("aria-hidden", "false");
  }

  function closeModal() {
    modal.classList.remove("show");
    modal.setAttribute("aria-hidden", "true");
  }

  closeBtn.addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("show")) closeModal();
  });

  // Events
  searchInput.addEventListener("input", () => renderBooks(getFilteredBooks()));
  genreFilter.addEventListener("change", () => renderBooks(getFilteredBooks()));

  // Initial render
  renderBooks(BOOKS);
});

// =========================
// Home Page: Auto-rotating quotes
// =========================
document.addEventListener("DOMContentLoaded", () => {
  const quoteEl = document.getElementById("quote");
  if (!quoteEl) return; // only runs on pages that have #quote

  const quotes = [
    "A reader lives a thousand lives before he dies.",
    "Not all those who wander are lost.",
    "It is only with the heart that one can see rightly.",
    "We read to know we are not alone.",
    "Words are, in my not-so-humble opinion, our most inexhaustible source of magic."
  ];

  let i = 0;
  quoteEl.textContent = quotes[i];

  setInterval(() => {
    i = (i + 1) % quotes.length;
    quoteEl.textContent = quotes[i];
  }, 4000); // changes every 4 seconds
});

// =========================
// Home Page: Author of the Day (date-based)
// =========================
document.addEventListener("DOMContentLoaded", () => {
  const authorEl = document.getElementById("author-name");
  if (!authorEl) return; // only runs on pages that have #author-name

  const authors = [
    { name: "Haruki Murakami", fact: "Known for surreal modern fiction and dreamlike realism." },
    { name: "Jane Austen", fact: "Master of sharp social commentary and romance." },
    { name: "George Orwell", fact: "Wrote powerful political fiction and essays." },
    { name: "Agatha Christie", fact: "The ‘Queen of Mystery’ with iconic detectives." },
    { name: "Toni Morrison", fact: "Nobel Prize-winning author of deeply human novels." },
    { name: "Arthur C. Clarke", fact: "A giant of science fiction and futurism." }
  ];

  // Date-based pick (same author all day, changes next day)
  const today = new Date();
  const dayIndex = Math.floor(today.getTime() / (1000 * 60 * 60 * 24)) % authors.length;

  const pick = authors[dayIndex];
  authorEl.textContent = `${pick.name} — ${pick.fact}`;
});

// =========================
// Newsletter: save email to localStorage + confirmation
// =========================
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("newsletter-form");
  const emailInput = document.getElementById("email");
  if (!form || !emailInput) return;

  // Prefill if previously saved
  const saved = localStorage.getItem("readify_newsletter_email");
  if (saved) emailInput.value = saved;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = emailInput.value.trim();
    if (!email) return;

    localStorage.setItem("readify_newsletter_email", email);

    // Simple confirmation (no extra HTML needed)
    alert("Subscribed! Your email has been saved.");
    form.reset();
  });
});


// =========================
// Progress Page Logic
// =========================
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("progress-form");
  if (!form) return; // only runs on progress.html

  const titleInput = document.getElementById("book-title");
  const totalInput = document.getElementById("total-pages");
  const readInput = document.getElementById("pages-read");
  const text = document.getElementById("progress-text");
  const fill = document.getElementById("progress-fill");

  // Load saved progress
  const saved = JSON.parse(localStorage.getItem("readify_progress"));
  if (saved) {
    titleInput.value = saved.title;
    totalInput.value = saved.total;
    readInput.value = saved.read;
    updateProgress(saved.title, saved.read, saved.total);
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const title = titleInput.value.trim();
    const total = Number(totalInput.value);
    const read = Number(readInput.value);

    if (read > total) {
      alert("Pages read cannot exceed total pages.");
      return;
    }

    const data = { title, total, read };
    localStorage.setItem("readify_progress", JSON.stringify(data));

    updateProgress(title, read, total);
  });

  function updateProgress(title, read, total) {
    const percent = Math.round((read / total) * 100);
    text.textContent = `"${title}" — ${percent}% completed`;
    fill.style.width = percent + "%";
  }
});


// =========================
// Recommend Page Logic
// =========================
document.addEventListener("DOMContentLoaded", () => {
  const genreSel = document.getElementById("recGenre");
  const lengthSel = document.getElementById("recLength");
  const recBtn = document.getElementById("recBtn");
  const againBtn = document.getElementById("againBtn");
  const saveBtn = document.getElementById("saveBtn");
  const result = document.getElementById("recResult");

  if (!genreSel || !lengthSel || !recBtn || !result) return; // only recommend.html

  // Simple recommendation pool (you can expand later)
  const recBooks = [
    { title: "Dune", author: "Frank Herbert", genre: "Sci-Fi", length: "long" },
    { title: "The Hobbit", author: "J.R.R. Tolkien", genre: "Fantasy", length: "medium" },
    { title: "The Great Gatsby", author: "F. Scott Fitzgerald", genre: "Classic", length: "short" },
    { title: "Foundation", author: "Isaac Asimov", genre: "Sci-Fi", length: "medium" },
    { title: "Animal Farm", author: "George Orwell", genre: "Classic", length: "short" },
    { title: "Mistborn", author: "Brandon Sanderson", genre: "Fantasy", length: "long" }
  ];

  let lastPick = null;

  function pickBook() {
    const g = genreSel.value;
    const l = lengthSel.value;

    let pool = recBooks.filter(b => {
      const genreOk = (g === "all") ? true : b.genre === g;
      const lengthOk = (l === "any") ? true : b.length === l;
      return genreOk && lengthOk;
    });

    if (pool.length === 0) {
      result.innerHTML = `<p class="muted">No matches for those filters. Try different options.</p>`;
      againBtn.disabled = true;
      saveBtn.disabled = true;
      lastPick = null;
      return;
    }

    const pick = pool[Math.floor(Math.random() * pool.length)];
    lastPick = pick;

    result.innerHTML = `
      <div class="rec-card">
        <div class="rec-title">${pick.title}</div>
        <div class="rec-meta">${pick.author} • ${pick.genre} • ${pick.length}</div>
        <p class="muted">Recommendation generated based on your selected filters.</p>
      </div>
    `;

    againBtn.disabled = false;
    saveBtn.disabled = false;
  }

  recBtn.addEventListener("click", pickBook);
  againBtn.addEventListener("click", pickBook);

  saveBtn.addEventListener("click", () => {
    if (!lastPick) return;

    const key = "readify_reading_list";
    const existing = JSON.parse(localStorage.getItem(key)) || [];

    // Prevent duplicates (same title + author)
    const already = existing.some(x => x.title === lastPick.title && x.author === lastPick.author);
    if (!already) existing.push(lastPick);

    localStorage.setItem(key, JSON.stringify(existing));
    alert(`Saved "${lastPick.title}" to your Reading List!`);
  });
});


// =========================
// Reading Flow Page Logic
// =========================
document.addEventListener("DOMContentLoaded", () => {
  const readingListEl = document.getElementById("readingList");
  const completedListEl = document.getElementById("completedList");
  const emptyReading = document.getElementById("emptyReading");
  const emptyCompleted = document.getElementById("emptyCompleted");
  const clearCompletedBtn = document.getElementById("clearCompleted");

  if (!readingListEl || !completedListEl) return; // only flow.html

    // =========================
  // Cozy Sounds (Play/Stop)
  // =========================
  const cozyAudio = document.getElementById("cozyAudio");
  const playBtn = document.getElementById("playCozy");
  const stopBtn = document.getElementById("stopCozy");

  if (cozyAudio && playBtn && stopBtn) {
    // Restore last state
    const wasPlaying = localStorage.getItem("readify_cozy_playing") === "true";
    if (wasPlaying) {
      cozyAudio.volume = 0.35;
      cozyAudio.play().then(() => {
        playBtn.disabled = true;
        stopBtn.disabled = false;
      }).catch(() => {
        // Autoplay can be blocked until user clicks
        localStorage.setItem("readify_cozy_playing", "false");
      });
    }

    playBtn.addEventListener("click", () => {
      cozyAudio.volume = 0.35;
      cozyAudio.play();
      playBtn.disabled = true;
      stopBtn.disabled = false;
      localStorage.setItem("readify_cozy_playing", "true");
    });

    stopBtn.addEventListener("click", () => {
      cozyAudio.pause();
      cozyAudio.currentTime = 0;
      playBtn.disabled = false;
      stopBtn.disabled = true;
      localStorage.setItem("readify_cozy_playing", "false");
    });
  }


  const LIST_KEY = "readify_reading_list";
  const DONE_KEY = "readify_completed_list";

  let reading = JSON.parse(localStorage.getItem(LIST_KEY)) || [];
  let completed = JSON.parse(localStorage.getItem(DONE_KEY)) || [];

  function saveAll(){
    localStorage.setItem(LIST_KEY, JSON.stringify(reading));
    localStorage.setItem(DONE_KEY, JSON.stringify(completed));
  }

  function render(){
    // Reading list
    readingListEl.innerHTML = "";
    if (reading.length === 0) {
      emptyReading.style.display = "block";
    } else {
      emptyReading.style.display = "none";
      reading.forEach((b, idx) => {
        const li = document.createElement("li");
        li.className = "flow-item";
        li.innerHTML = `
          <strong>${b.title}</strong>
          <div class="muted">${b.author} • ${b.genre} • ${b.length}</div>
          <div class="flow-actions">
            <button type="button" data-action="done" data-index="${idx}">Mark Completed</button>
            <button type="button" data-action="remove" data-index="${idx}">Remove</button>
          </div>
        `;
        readingListEl.appendChild(li);
      });
    }

    // Completed list
    completedListEl.innerHTML = "";
    if (completed.length === 0) {
      emptyCompleted.style.display = "block";
    } else {
      emptyCompleted.style.display = "none";
      completed.forEach((b, idx) => {
        const li = document.createElement("li");
        li.className = "flow-item";
        li.innerHTML = `
          <strong>${b.title}</strong>
          <div class="muted">${b.author} • Completed</div>
          <div class="flow-actions">
            <button type="button" data-action="undo" data-index="${idx}">Undo</button>
          </div>
        `;
        completedListEl.appendChild(li);
      });
    }
  }

  // Click handling for Reading list buttons
  readingListEl.addEventListener("click", (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;

    const action = btn.dataset.action;
    const idx = Number(btn.dataset.index);
    const item = reading[idx];
    if (!item) return;

    if (action === "done") {
      completed.unshift({ title: item.title, author: item.author, when: new Date().toISOString() });
      reading.splice(idx, 1);
      saveAll();
      render();
    }

    if (action === "remove") {
      reading.splice(idx, 1);
      saveAll();
      render();
    }
  });

  // Click handling for Completed list undo
  completedListEl.addEventListener("click", (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;

    const action = btn.dataset.action;
    const idx = Number(btn.dataset.index);
    const item = completed[idx];
    if (!item) return;

    if (action === "undo") {
      // put back into reading list (minimal fields)
      reading.unshift({ title: item.title, author: item.author, genre: "Unknown", length: "any" });
      completed.splice(idx, 1);
      saveAll();
      render();
    }
  });

  clearCompletedBtn.addEventListener("click", () => {
    completed = [];
    saveAll();
    render();
  });

  render();
});


// =========================
// Feedback Page Logic
// =========================
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("feedbackForm");
  const status = document.getElementById("fbStatus");

  if (!form || !status) return; // only feedback.html

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("fbName").value.trim();
    const email = document.getElementById("fbEmail").value.trim();
    const msg = document.getElementById("fbMessage").value.trim();

    if (name.length < 2) {
      showStatus("Please enter a valid name.", true);
      return;
    }

    if (!email.includes("@") || !email.includes(".")) {
      showStatus("Please enter a valid email address.", true);
      return;
    }

    if (msg.length < 5) {
      showStatus("Message is too short.", true);
      return;
    }

    // Save to localStorage as evidence of functionality
    const feedback = { name, email, msg, when: new Date().toISOString() };
    localStorage.setItem("readify_last_feedback", JSON.stringify(feedback));

    showStatus("Thanks! Your feedback was saved locally.", false);
    form.reset();
  });

  function showStatus(message, isError){
    status.style.display = "block";
    status.textContent = message;
    status.style.color = isError ? "#ffb4b4" : "var(--muted)";
  }

  // FAQ accordion
  document.querySelectorAll(".faq-q").forEach(btn => {
    btn.addEventListener("click", () => {
      const box = btn.closest(".faq");
      box.classList.toggle("open");
    });
  });
});
