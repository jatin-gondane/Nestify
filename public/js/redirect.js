  const count = document.getElementById("count");
  let timeLeft = 10;
  const timer = setInterval(() => {
    timeLeft--;
    count.textContent = timeLeft;

    if (timeLeft === 0) {
      clearInterval(timer);
      window.location.href = "/listing";
    }
  }, 1000);