document.addEventListener("DOMContentLoaded", function () {
  // --- Smooth Scrolling ---
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      document.querySelector(this.getAttribute("href")).scrollIntoView({
        behavior: "smooth",
      });
    });
  });

  // --- Tab Functionality ---
  const tabButtons = document.querySelectorAll(".tab-btn");
  const tabPanes = document.querySelectorAll(".tab-pane");
  const tabContentContainer = document.getElementById("tab-content");

  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const targetTab = button.dataset.tab;

      tabButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");

      tabContentContainer.classList.remove("visible");

      setTimeout(() => {
        tabPanes.forEach((pane) => {
          if (pane.id === `${targetTab}-content`) {
            pane.classList.remove("hidden");
          } else {
            pane.classList.add("hidden");
          }
        });
        tabContentContainer.classList.add("visible");
      }, 300);
    });
  });

  // --- Fade-in on Scroll ---
  const faders = document.querySelectorAll(".fade-in");
  const appearOptions = {
    threshold: 0.2,
    rootMargin: "0px 0px -50px 0px",
  };

  const appearOnScroll = new IntersectionObserver(function (
    entries,
    appearOnScroll
  ) {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      } else {
        entry.target.classList.add("visible");
        appearOnScroll.unobserve(entry.target);
      }
    });
  },
  appearOptions);

  faders.forEach((fader) => {
    appearOnScroll.observe(fader);
  });

  // --- Gemini API Functionality ---
  const generateBtn = document.getElementById("ai-generate-btn");
  const promptInput = document.getElementById("ai-prompt-input");
  const resultText = document.getElementById("ai-result-text");
  const loader = document.getElementById("ai-loader");
  const themeButtons = document.querySelectorAll(".ai-theme-btn");

  const generateMarketingIdea = async (theme) => {
    resultText.classList.add("hidden");
    loader.classList.remove("hidden");

    const prompt = `为朱家角景区的'角里囡囡'IP娃娃，设计一句吸引"${theme}"的营销标语或社交媒体文案。要求有创意，能体现娃娃的故事性和情感价值。请直接返回文案，不要有多余的解释。`;

    let chatHistory = [];
    chatHistory.push({ role: "user", parts: [{ text: prompt }] });
    const payload = { contents: chatHistory };
    const apiKey = "";
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const result = await response.json();

      if (
        result.candidates &&
        result.candidates.length > 0 &&
        result.candidates[0].content &&
        result.candidates[0].content.parts &&
        result.candidates[0].content.parts.length > 0
      ) {
        const text = result.candidates[0].content.parts[0].text;
        resultText.textContent = text.trim();
      } else {
        resultText.textContent = "抱歉，AI暂时没有灵感，请稍后再试。";
      }
    } catch (error) {
      console.error("Error calling Gemini API:", error);
      resultText.textContent = "调用AI服务时出错，请检查网络连接或稍后重试。";
    } finally {
      loader.classList.add("hidden");
      resultText.classList.remove("hidden");
    }
  };

  generateBtn.addEventListener("click", () => {
    const theme = promptInput.value.trim();
    if (theme) {
      generateMarketingIdea(theme);
    } else {
      alert("请输入一个主题！");
    }
  });

  themeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const theme = button.textContent;
      promptInput.value = theme;
      generateMarketingIdea(theme);
    });
  });

  // Intersection Observer for fade-in animations
  const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.1,
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target); // Stop observing once visible
      }
    });
  }, observerOptions);

  // Observe all elements with fade-in class
  document.addEventListener("DOMContentLoaded", () => {
    const fadeElements = document.querySelectorAll(".fade-in");
    fadeElements.forEach((element) => {
      observer.observe(element);
    });
  });
});
