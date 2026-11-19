const form = document.querySelector("#custom-order-form");
const finishRadios = [...document.querySelectorAll('input[name="finishType"]')];
const sizeRadios = [...document.querySelectorAll('input[name="size"]')];
const colorChecks = [...document.querySelectorAll('input[name="color"]')];
const addonChecks = [...document.querySelectorAll('input[name="addon"]')];
const inspiration = document.querySelector("#inspiration");
const fileName = document.querySelector("#file-name");
const errorMessage = document.querySelector("#form-error");
const deliveryDate = document.querySelector("#delivery-date");
const deliveryMethod = document.querySelector("#delivery-method");
const estimatedTotal = document.querySelector("#estimated-total");
const depositDue = document.querySelector("#deposit-due");
const balanceDue = document.querySelector("#balance-due");
const summaryBreakdown = document.querySelector("#summary-breakdown");
const finishConfirmation = document.querySelector("#finish-confirmation");
const deliveryCharge = 100;
const currency = amount => `KSh ${Number(amount).toLocaleString("en-KE")}`;

const localToday = new Date();
localToday.setDate(localToday.getDate() + 3);
const dateOffset = localToday.getTimezoneOffset();
deliveryDate.min = new Date(localToday.getTime() - dateOffset * 60000).toISOString().split("T")[0];

function selectedFinish() {
  return finishRadios.find(radio => radio.checked)?.value || "";
}

function selectedBasePrice() {
  const size = sizeRadios.find(radio => radio.checked);
  const finish = selectedFinish();
  if (!size || !finish) return 0;
  return Number(size.dataset[finish === "Glitter Roses" ? "glitter" : "classic"]);
}

function selectedAddonTotal() {
  return addonChecks.reduce((total, checkbox) => {
    if (!checkbox.checked) return total;
    const quantityInput = checkbox.closest(".addon-row").querySelector(".addon-quantity");
    const quantity = quantityInput ? Number(quantityInput.value || 1) : 1;
    return total + Number(checkbox.dataset.unitPrice) * quantity;
  }, 0);
}

function updateEstimate() {
  const finish = selectedFinish();
  const size = sizeRadios.find(radio => radio.checked);
  const colors = colorChecks.filter(input => input.checked).map(input => input.value);
  const selectedAddons = addonChecks.filter(input => input.checked).map(input => {
    const quantity = input.closest(".addon-row").querySelector(".addon-quantity");
    return quantity ? `${input.value} × ${quantity.value}` : input.value;
  });
  const basePrice = selectedBasePrice();
  const addonTotal = selectedAddonTotal();
  const deposit = basePrice * 0.5;
  const total = basePrice + addonTotal + deliveryCharge;
  estimatedTotal.textContent = basePrice ? currency(total) : "Choose finish and size";
  depositDue.textContent = basePrice ? currency(deposit) : "—";
  balanceDue.textContent = basePrice ? currency(total - deposit) : "—";
  summaryBreakdown.textContent = [
    `${finish || "Choose finish"} | ${size?.value || "Choose size"}`,
    `Colours: ${colors.length ? colors.join(", ") : "Choose colour"}`,
    `Extras: ${selectedAddons.length ? selectedAddons.join(", ") : "None selected"}`,
    `Roses ${basePrice ? currency(basePrice) : "—"} + extras ${currency(addonTotal)} + ${deliveryMethod.value || "delivery"} ${currency(deliveryCharge)}`
  ].join("\n");

  sizeRadios.forEach(radio => {
    const price = Number(radio.dataset[finish === "Glitter Roses" ? "glitter" : "classic"]);
    radio.closest(".size-option").querySelector(".size-price").textContent = finish ? currency(price) : "Select finish";
  });
}

finishRadios.forEach(radio => radio.addEventListener("change", updateEstimate));
sizeRadios.forEach(radio => radio.addEventListener("change", updateEstimate));
colorChecks.forEach(input => input.addEventListener("change", updateEstimate));
addonChecks.forEach(checkbox => {
  const row = checkbox.closest(".addon-row");
  const quantity = row.querySelector(".addon-quantity");
  const controls = row.querySelectorAll("[data-quantity-change]");
  if (quantity) {
    checkbox.addEventListener("change", () => {
      quantity.disabled = !checkbox.checked;
      controls.forEach(button => { button.disabled = !checkbox.checked; });
      updateEstimate();
    });
    quantity.addEventListener("input", updateEstimate);
  } else {
    checkbox.addEventListener("change", updateEstimate);
  }
  controls.forEach(button => button.addEventListener("click", () => {
    quantity.value = String(Math.max(Number(quantity.min), Math.min(Number(quantity.max), Number(quantity.value) + Number(button.dataset.quantityChange))));
    updateEstimate();
  }));
});
document.querySelector("#confirm-finish").addEventListener("click", () => {
  const chosen = selectedFinish();
  finishConfirmation.textContent = chosen ? `${chosen} selected. Continue choosing your size and colour below.` : "Please choose Ribbon Roses or Glitter Roses first.";
  finishConfirmation.classList.toggle("confirmed", Boolean(chosen));
});
deliveryMethod.addEventListener("change", updateEstimate);
updateEstimate();

inspiration.addEventListener("change", () => {
  const selectedFile = inspiration.files[0];
  fileName.textContent = selectedFile ? selectedFile.name : "";
  if (selectedFile && selectedFile.size > 5 * 1024 * 1024) {
    inspiration.value = "";
    fileName.textContent = "";
    errorMessage.textContent = "Please choose an inspiration photo smaller than 5 MB.";
    errorMessage.classList.add("visible");
  } else {
    errorMessage.textContent = "";
    errorMessage.classList.remove("visible");
  }
});

form.addEventListener("submit", event => {
  event.preventDefault();
  errorMessage.textContent = "";
  errorMessage.classList.remove("visible");
  if (!colorChecks.some(input => input.checked)) {
    errorMessage.textContent = "Please choose at least one rose colour.";
    errorMessage.classList.add("visible");
    colorChecks[0].focus();
    return;
  }
  if (!form.reportValidity()) return;

  const data = new FormData(form);
  const selectedSize = sizeRadios.find(radio => radio.checked);
  const basePrice = selectedBasePrice();
  const addOnDetails = addonChecks.filter(input => input.checked).map(input => {
    const quantityInput = input.closest(".addon-row").querySelector(".addon-quantity");
    const quantity = quantityInput ? Number(quantityInput.value || 1) : 1;
    const cost = Number(input.dataset.unitPrice) * quantity;
    return `${input.value}${quantityInput ? ` x ${quantity}` : ""} (${currency(cost)})`;
  });
  const addOnTotal = selectedAddonTotal();
  const deposit = basePrice * 0.5;
  const total = basePrice + addOnTotal + deliveryCharge;
  const selectedFile = inspiration.files[0];
  const message = [
    "Hello! I'd like to request a custom bouquet from WEM'S PETALS AND DECOR.",
    `Rose finish: ${data.get("finishType")}`,
    `Bouquet size: ${selectedSize.value}`,
    `Rose colour(s): ${data.getAll("color").join(", ")}`,
    `Bouquet price: ${currency(basePrice)}`,
    `Add-ons: ${addOnDetails.join(", ") || "None"} (${currency(addOnTotal)})`,
    `50% rose deposit required: ${currency(deposit)}`,
    `Delivery: Nairobi ${data.get("deliveryMethod")} (${currency(deliveryCharge)})`,
    `Estimated total: ${currency(total)}`,
    `Balance after deposit: ${currency(total - deposit)}`,
    "Please note: orders need 3–4 days' advance notice.",
    `Occasion: ${data.get("occasion")}`,
    `Preferred delivery date: ${data.get("deliveryDate")}`,
    data.get("customerName") ? `Name: ${data.get("customerName")}` : "",
    data.get("instructions") ? `Special instructions: ${data.get("instructions")}` : "",
    selectedFile ? `I have an inspiration photo (${selectedFile.name}) and will attach it in this WhatsApp chat.` : ""
  ].filter(Boolean).join("\n");

  const whatsappUrl = `https://wa.me/254746053722?text=${encodeURIComponent(message)}`;
  window.location.assign(whatsappUrl);
});
