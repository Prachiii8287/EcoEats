const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input span");
const chatbox = document.querySelector(".chatbox");
const chatbotToggler = document.querySelector(".chatbot-toggler");
const chatbotCloseBtn = document.querySelector(".close-btn ");

let userMessage;
const API_KEY = "sk-proj-gSrtLde57O2NNIb2ltnnT3BlbkFJuvB3V5eapGobJxCnhvlo";
const inputInitHeight = chatInput.scrollHeight;

const createChatLi = (message, className, sender) => {
  // Create a chat <li> element with passed message, className, and sender
  const chatLi = document.createElement("li");
  chatLi.classList.add("chat", className);
  let chatContent = "";

  if (sender === "user") {
    // Outgoing message from user
    chatContent = `<p>${message}</p>`;
    chatLi.style.textAlign = "right"; // Align to the right
    // chatLi.style.backgroundColor = "#ddd"; // Light background color
  } else {
    // Incoming message from bot
    chatContent = `<span class="material-symbols-outlined">smart_toy</span> <p>${message}</p>`;
  }

  chatLi.innerHTML = chatContent;
  return chatLi;
};

const fixedResponses = {
  "what is ecoeats": "EcoEats is a groundbreaking platform tackling global issues like food waste and environmental sustainability through innovative technology. It's a digital hub connecting individuals, NGOs, and businesses to combat food waste and promote eco-friendly practices. Users can donate surplus food to those in need or compost organic waste, reducing landfill waste and nourishing soil health. Unique features like green tokens incentivize sustainable actions, driving positive environmental impact. By fostering collaboration and leveraging technology, EcoEats strives to create a more sustainable food system and protect the planet for future generations.",
  "how does ecoeats work": "EcoEats is a tech-driven platform combating food waste and promoting sustainability. Users engage in activities like food donation and composting organic waste, facilitated by innovative partnerships and technologies. Green tokens incentivize eco-friendly actions, fostering community participation and accountability. With a focus on transparency, EcoEats empowers users to trust in its integrity and contribute to environmental conservation efforts. Through these initiatives, EcoEats empowers individuals to make a tangible impact on building a sustainable future.",
  "what is sustainability":"Sustainability involves meeting present needs without jeopardizing those of future generations. It balances environmental, social, and economic factors, minimizing resource depletion and environmental harm while promoting social equity and economic viability. Sustainable practices aim to harmonize human activities with the planet's ecosystems, ensuring long-term well-being for all.",
  "how does ecoeats promotes sustainability":"EcoEats leads the charge in sustainability by addressing food waste through donation and composting initiatives. It connects donors with NGOs, redistributing surplus food and diverting organic waste from landfills. Green tokens incentivize participation and community engagement, while advanced technologies enhance user experience and efficiency. Transparency and accountability are core principles, ensuring trust in EcoEats' integrity and environmental impact. Overall, EcoEats promotes sustainable living and a greener future for all.",
  "is ecoeats sustainable": "EcoEats leads the charge in sustainability by addressing food waste through donation and composting initiatives. It connects donors with NGOs, redistributing surplus food and diverting organic waste from landfills. Green tokens incentivize participation and community engagement, while advanced technologies enhance user experience and efficiency. Transparency and accountability are core principles, ensuring trust in EcoEats' integrity and environmental impact. Overall, EcoEats promotes sustainable living and a greener future for all.",
  "what is tokenization":"Tokenization in EcoEats involves converting eco-friendly actions into digital tokens called green tokens. These tokens serve as rewards for users who engage in sustainable behaviors like food donation and organic waste composting. Green tokens can be earned and redeemed within the platform for incentives, promoting sustainability and community engagement.. Users can redeem tokens after the completion of a progress bar, which increases by 25% each time organic waste is contributed. ",
  "what are green tokens":"Green tokens are digital assets within the EcoEats platform that serve as rewards for users who engage in eco-friendly actions, such as food donation and organic waste composting. These tokens incentivize sustainable behavior and can be earned and redeemed within the platform for various rewards and incentives. After redeeming green tokens, they are stored in Metamask, a cryptocurrency wallet, allowing users to convert them into Indian Rupees (INR) and use them for peer-to-peer trade.",
  "what is organic waste":"Organic waste, derived from living organisms, includes food scraps, yard trimmings, and plant-based materials. It's generated by households, food processing facilities, agriculture, and landscaping. When disposed of in landfills, it decomposes anaerobically, emitting methane. However, composting or anaerobic digestion can convert organic waste into compost or biogas, offering a sustainable solution to reduce pollution and conserve resources.",
  "how to create account on metamask": "To create an account on MetaMask, start by installing the MetaMask extension from the browser store. Once installed, launch MetaMask and click Get Started. Here, you'll be prompted to create a strong password for your wallet. After setting your password, MetaMask will generate a unique seed phrase, which you must securely write down and store. Confirm the seed phrase to ensure accuracy. Your MetaMask wallet is now created and ready to use. Customize settings as needed, such as adding additional accounts. Remember to keep your password and seed phrase secure at all times to protect your wallet.",
  "what is metamask":"MetaMask, a cryptocurrency wallet and browser extension, enables users to engage with the Ethereum blockchain and decentralized applications (dApps) directly from their web browser. In EcoEats, MetaMask acts as a digital wallet for managing green tokens, the platform's native digital asset. Users connect their MetaMask wallet to EcoEats to earn and redeem green tokens through eco-friendly actions like food donation and composting. Moreover, MetaMask facilitates converting green tokens into fiat currency (e.g., INR) and facilitates peer-to-peer token trading within the EcoEats ecosystem. By ensuring seamless and secure transactions, MetaMask empowers users to adopt sustainable practices through blockchain technology within EcoEats."

  

  // Add more questions and answers here
};

const generateResponse = (incomingChatLi) => {
  const API_URL = "https://api.openai.com/v1/chat/completions";
  const messageElement = incomingChatLi.querySelector("p");

  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",  // Uncomment and replace with your model if using GPT-3.5
      messages: [
        {
          role: "user",
          content: userMessage,
        },
      ],
    }),
  };

  // Send POST request API ,get response
  fetch(API_URL, requestOptions)
    .then((res) => res.json())
    .then((data) => {
      messageElement.textContent = data.choices[0].message.content;
    })
    .catch((error) => {
      messageElement.classList.add("error");
      messageElement.textContent = "Oops! Something went wrong. Please try again.";
    })
    .finally(() => chatbox.scrollTo(0, chatbox.scrollHeight));
};

const handleChat = () => {
  userMessage = chatInput.value.trim().toLowerCase();
  if (!userMessage) return;
  chatInput.value = "";

  const fixedAnswer = fixedResponses[userMessage];
  if (fixedAnswer) {
    // Found a fixed answer, display it directly
    const outgoingChatLi = createChatLi(userMessage, "outgoing", "user");
    const incomingChatLi = createChatLi(fixedAnswer, "incoming", "bot");
    chatbox.appendChild(outgoingChatLi);
    chatbox.appendChild(incomingChatLi);
    chatbox.scrollTo(0, chatbox.scrollHeight);
    return; // Exit the function to prevent triggering GPT-3.5
  }

  // No fixed answer, use GPT-3.5 integration
  console.log("No fixed answer found, using GPT-3.5:", userMessage);
  const incomingChatLi = createChatLi("Thinking...", "incoming", "bot");
  chatbox.appendChild(incomingChatLi);
  chatbox.scrollTo(0, chatbox.scrollHeight);
  generateResponse(incomingChatLi);
};

chatInput.addEventListener("input", () => {
  // Adjust the height of the input textarea based on its content
  chatInput.style.height = `${inputInitHeight}px`;
  chatInput.style.height = `${chatInput.scrollHeight}px`;
});

sendChatBtn.addEventListener("click",handleChat);
chatbotCloseBtn.addEventListener("click",() => document.body.classList.remove("show-chatbot"));
chatbotToggler.addEventListener("click",() => document.body.classList.toggle("show-chatbot"));

  