document.querySelectorAll(".donate-btn").forEach(button => {
  button.addEventListener("click", async () => {
    const amount = parseInt(button.getAttribute("data-amount"));

    try {
      const res = await fetch("/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }),
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Something went wrong.");
      }
    } catch (err) {
      console.error(err);
      alert("Error connecting to the server.");
    }
  });
});
