let isOpen = false;

const cards = document.querySelectorAll(".card");
const overlay = document.querySelector(".overlay");
const sealAlphaCache = {};

function loadSealAlpha(img) {
  const src = img.src;
  if (sealAlphaCache[src]) return Promise.resolve(sealAlphaCache[src]);
  return new Promise((resolve) => {
    const canvas = document.createElement("canvas");
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => {
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(image, 0, 0);
      sealAlphaCache[src] = {
        canvas,
        ctx,
        width: image.naturalWidth,
        height: image.naturalHeight,
      };
      resolve(sealAlphaCache[src]);
    };
    image.src = src;
  });
}

function getAlphaAtPoint(alphaData, x, y, elRect) {
  const px = Math.floor(((x - elRect.left) / elRect.width) * alphaData.width);
  const py = Math.floor(((y - elRect.top) / elRect.height) * alphaData.height);
  const pixel = alphaData.ctx.getImageData(px, py, 1, 1).data;
  return pixel[3];
}

const letterContent = {
  sleep:
    "Heyyy Momo\n\n" +
    "It's late. Everyone else is asleep and your mind won't stop. I know that feeling of lying there, staring at the ceiling, thoughts running in circles you can't seem to break out of.\n\n" +
    "I'd want to be there right now. I'd probably be asleep already (you know how I am), but I'd want you to wake me up. I wouldn't mind. Not for this.\n\n" +
    "Put your phone down after this. No TikTok. No doomscrolling.\n\n" +
    "Think about your favourite memories.\n\n" +
    "You don't have to solve anything tonight. Whatever's keeping you up will still be there tomorrow, and we can face it together. Tonight, just rest.\n\n" +
    "You are loved. Even when you're overthinking at midnight and sleep won't come.\n\n" +
    "Close your eyes. I'm right there with you.\n\n" +
    "— H",

  breathe:
    "You opened this, which means you remembered to take a break. Gooood\n\n" +
    "You've been giving your all. I can tell you've been giving your energy to everything and everyone, and somewhere in the middle of all that, you forgot to give any of it to yourself.\n\n" +
    "This is your sign to stop for a minute. Not forever. Just now.\n\n" +
    "Go get a glass of water. Step outside if you can, even for two minutes. Feel the air. Let your shoulders drop, as I know they've been up near your ears all day, haven't they?\n\n" +
    "You are allowed to need rest. You are allowed to not be productive every second. You are allowed to just exist for a moment without earning it. And you don't have to feel guilty about that.\n\n" +
    "I love you for how hard you try. But I also love you when you're doing absolutely nothing. Remember that.\n\n" +
    "Come back when you're ready. There's no rush.\n\n" +
    "— H",

  overwhelmed:
    "Stop. Just for a second.\n\n" +
    "I know everything feels like too much right now. Like you're holding it all together with your hands and one more thing will make it all fall apart.\n\n" +
    "But you haven't fallen apart yet. And I've watched you carry more than this.\n\n" +
    "You don't have to do everything today. You don't have to do everything perfectly. You just have to do the next small thing, one thing at a time. That's it.\n\n" +
    "And if even that feels impossible, then the next thing is just breathing. That also counts.\n\n" +
    "I know you put so much pressure on yourself. I know you hate feeling like you can't handle it. But being overwhelmed doesn't mean you're failing. It means you're human, and you've been pushing hard.\n\n" +
    "When you get through today, and I know you will, I want to hear about it. I want to sit with you and let you talk about how you're feeling. You don't have to hold it alone.\n\n" +
    "Close this letter. Take three slow breaths. Then do one small thing at a time.\n\n" +
    "I'm proud of you. Even on the days you're barely keeping it together.\n\n" +
    "— H",

  badday:
    "Bad day? I knoww :(\n\n" +
    "I don't know what happened yet but I know it was hard. And I know you probably didn't let anyone see that today.\n\n" +
    "You don't have to explain it if you don't want to. You don't have to make it make sense. Some days are just bad. They don't need a reason and they don't need a lesson. They just need to end.\n\n" +
    "Give yourself permission to let this day be over. You don't have to process it tonight. You don't have to turn it into growth. You don't have to be okay by morning.\n\n" +
    "What would help right now? Something you love, something in your comfort zone. Do that thing. Give yourself that.\n\n" +
    "And then, when you can, talk to me. Tell me about it. Not to fix it. Just so you're not alone with it. That's all.\n\n" +
    "You survived today. I know it doesn't feel like much. But you did.\n\n" +
    "Tomorrow doesn't have to be better right away. It just has to be tomorrow.\n\n" +
    "I love you. Even on your worst days. Especially then.\n\n" +
    "— H",

  pain:
    "I'm sorry. I genuinely am.\n\n" +
    "This is one of those moments where I wish I could just be there, with chocolate and snacks, something warm, and zero expectation of you being okay right now.\n\n" +
    "You don't have to be okay right now.\n\n" +
    "Please take your pain medication if you haven't. Please lie down. Please give yourself full permission to cancel, delay, and ignore everything that isn't urgent. Whatever you had planned can wait. You are not obligated to push through this.\n\n" +
    "Your body is doing something hard. That's not weakness, that's you being strong just by going through it.\n\n" +
    "If I could be there I'd bring you a hot water bottle, a blanket, and watch TV with you. I'd sit with you and not make it weird and let you complain as much as you needed to.\n\n" +
    "You're allowed to be miserable about this. It is genuinely miserable.\n\n" +
    "Rest. Eat something. Be gentle with yourself the way you would be with me.\n\n" +
    "I love you, even when — especially when — you're curled up and suffering.\n\n" +
    "— H",

  selfdoubt:
    "I need you to hear me right now.\n\n" +
    "Whatever you're doubting — your ability, your worth, whether you're enough — I need you to know that the version of you I know doesn't match the version you're describing to yourself right now.\n\n" +
    "You are not as behind as you think. You are not as lost as you feel. You are not a burden, you are not too much, and you are not running out of chances.\n\n" +
    "I have watched you push through pages of notes late at night. I have watched you push through things that would have stopped other people. I have seen you at your lowest and I have never once thought less of you.\n\n" +
    "The voice that's telling you that you're not enough? It's lying. It's tired and scared and it's confusing fear with truth.\n\n" +
    "You don't have to feel confident right now. But I need you to hold on to the possibility that you might be wrong about yourself. Because I am very certain that you are.\n\n" +
    "I believe in you on the days you can't believe in yourself. That's what I'm here for.\n\n" +
    "You're not behind. You're just in the middle of it.\n\n" +
    "— H",

  lonely:
    "I'm here.\n\n" +
    "I know I'm not physically here right now, and I know a letter can't fix that. But I want you to know that wherever I am, I am thinking about you. Not in a passing way. Part of you stays within me.\n\n" +
    "Loneliness is one of the hardest feelings because it makes you question things. Whether you matter. Whether anyone would notice. Whether the connections you have are real.\n\n" +
    "You matter. I always notice you.\n\n" +
    "I want you to reach out to someone today — not necessarily me if you don't want to, just in addition. A friend. A family member. Even a text to someone you haven't spoken to in a while. Connection doesn't have to be perfect to help.\n\n" +
    "And if you can't bring yourself to do that right now, then just know: I am at the other end of a text or call whenever you want me. Even if it's just a little message, a random topic, a picture.\n\n" +
    "You are not as alone as loneliness tells you you are.\n\n" +
    "I'm right here. Come find me.\n\n" +
    "— H",

  fight:
    "Hiii\n\n" +
    "I'm glad you found this letter.\n\n" +
    "At the time I'm writing this, I don't know what we fought about. But I know this: I don't want to be right more than I want to be close to you. I need you to know that, especially when it doesn't feel true in the moment.\n\n" +
    "I will sometimes say things badly. I will sometimes push when I should give space, or go quiet when I should speak. I'm not going to be perfect at this. But I am going to try, and I am never going to stop wanting us to work through it.\n\n" +
    "Whatever it was — it doesn't change how I feel about you. Anger and love are not opposites. I can be frustrated and still be completely, fully yours.\n\n" +
    "When we're both ready: let's talk. Not to win. Just to understand each other again.\n\n" +
    "I'm not going anywhere. I just need us to come back to each other.\n\n" +
    "I love you. Even right now. Especially right now.\n\n" +
    "— H",

  mad:
    "Okay. You're mad.\n\n" +
    "I'm not going to tell you to calm down.\n\n" +
    "Whatever happened, you're allowed to be angry. Anger is real and it's valid and it means something mattered to you. That's not a flaw.\n\n" +
    "But I want to ask you one thing before you do anything: is this the kind of mad that needs action right now, or is it the kind that just needs space first?\n\n" +
    "If it's the second kind, give yourself the time you deserve. Not to suppress it. Just to let it settle enough that you can see it clearly.\n\n" +
    "If you're mad at me, I want to know. Not in a passive way. I want to actually hear it, when you're ready. We don't have to be okay with things that aren't okay.\n\n" +
    "If you're mad at something else, I'm on your side. Tell me. I'll even be angry with you if that's what you need.\n\n" +
    "You are not too much when you're angry. You're just feeling something loudly. I can handle it.\n\n" +
    "Come to me when you're ready.\n\n" +
    "— H",

  happy:
    "Hiii, appy you.\n\n" +
    "I love this version of you. Not more than the other versions, but I love seeing it. The way you get when things are good.\n\n" +
    "Don't overthink it. Don't wait for the other shoe to drop. Don't make yourself smaller because happiness feels fragile.\n\n" +
    "You are allowed to just be happy. Right now, in this moment, without justifying it or questioning whether you deserve it.\n\n" +
    "I hope you're smiling. I hope you're proud of yourself. I hope you let this feeling take up room.\n\n" +
    "This is what I want for you. Not just on the big days. On ordinary Tuesdays. On slow mornings. On random afternoons when nothing in particular happens and somehow it's still good.\n\n" +
    "I love you when you're happy. Go be it.\n\n" +
    "— H",

  greatday:
    "YESSS. Tell me everything.\n\n" +
    "I love this for you. I love that you're having a great day and I love that you thought of me in the middle of it.\n\n" +
    "Whatever happened today, big or small, it matters. You matter. Good things happening to you is not luck. It's you showing up, doing the work, being yourself. Don't brush past it.\n\n" +
    "I want to celebrate this with you. I want to hear you yap about it all, and I'll listen to you like I always do. I want all the details.\n\n" +
    "Write them down somewhere if you can. The feeling of today — put it somewhere safe. Because on the hard days, you're going to need to remember that this existed. That days like this are real.\n\n" +
    "I am so proud of you. Not just for today, but for everything that led here.\n\n" +
    "Now go enjoy it. All of it. You've earned it. Can't wait to hear about it.\n\n" +
    "— H",

  missme:
    "I miss youu toooo.\n\n" +
    "Whatever the distance is — km, hours, circumstances — I feel it. I always feel it. You are not missing me alone.\n\n" +
    "I think about your notification popping up on my lockscreen. I think about the specific way you giggle, smile, and talk about your whole day. I think about the next time I get to be near you and I let myself look forward to it even when the waiting is hard.\n\n" +
    "Missing you means you're worth missing. I don't want us to be the kind of people who are indifferent to distance. I'd rather it hurt a little because it means it matters.\n\n" +
    "But I don't want you to sit too long in this one. Do something that makes you feel close to me — listen to our favourite song, or think about the happy memories we share. Or just text me. Tell me you read this. I want to know.\n\n" +
    "This feeling of distance is temporary.\n\n" +
    "Remember I love you. Part of me lives within you.\n\n" +
    "— H",
};

// single persistent overlay listener
function handleOverlayClick() {}
let currentClose = null;
overlay.addEventListener("click", () => {
  if (currentClose) currentClose();
});

// ESC key to close
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && currentClose) currentClose();
});

function openCard(card) {
  if (isOpen) return;
  isOpen = true;

  const clone = card.cloneNode(true);
  clone.classList.add("is-active");
  clone.style.transform = "translate(-50%, -50%) scale(0.85)";
  clone.style.opacity = "0";
  clone.removeAttribute("tabindex");
  document.body.appendChild(clone);

  // --- letter card ---
  const moodKey = [...card.classList].find((c) => c !== "card");
  const letterCard = document.createElement("div");
  letterCard.classList.add("letter-card");
  const letterText = document.createElement("p");
  letterText.classList.add("letter-text");
  letterText.textContent =
    letterContent[moodKey] ?? "You do not have access to this letter yet.";
  letterCard.appendChild(letterText);
  document.body.appendChild(letterCard);

  // --- close button ---
  const closeBtn = document.createElement("button");
  closeBtn.classList.add("close-btn");
  closeBtn.setAttribute("aria-label", "Close letter");
  closeBtn.textContent = "✕";
  document.body.appendChild(closeBtn);

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      clone.style.transform = "translate(-50%, -50%) scale(1.4)";
      clone.style.opacity = "1";

      clone.addEventListener(
        "transitionend",
        (e) => {
          if (e.propertyName !== "transform") return;
          const cardRect = clone.getBoundingClientRect();
          const gap = (window.innerHeight - cardRect.bottom) / 2;
          closeBtn.style.bottom = `${gap}px`;
        },
        { once: true },
      );
    });
  });

  card.classList.add("is-hidden");
  overlay.style.opacity = "1";
  overlay.style.pointerEvents = "auto";
  document.body.style.overflow = "hidden";

  const seal = clone.querySelector(".wax-seal");
  let sealOpened = false;

  function openEnvelope() {
    if (sealOpened) return;
    sealOpened = true;

    const closed = clone.querySelector(".envelope-closed");
    const open = clone.querySelector(".envelope-open");

    seal.style.opacity = "0";
    closed.style.opacity = "0";
    open.style.opacity = "1";

    let transitionFired = false;

    function revealLetter() {
      if (transitionFired) return;
      transitionFired = true;

      clone.style.opacity = "0";
      clone.style.pointerEvents = "none";
      letterCard.classList.add("is-visible");

      const letterRect = letterCard.getBoundingClientRect();
      const gap = (window.innerHeight - letterRect.bottom) / 2;
      closeBtn.style.bottom = `${gap}px`;

      letterCard.setAttribute("tabindex", "-1");
      letterCard.focus();
    }

    open.addEventListener("transitionend", () => revealLetter(), {
      once: true,
    });
    setTimeout(revealLetter, 600);
  }

  loadSealAlpha(seal).then((alphaData) => {
    clone.addEventListener("mousemove", (e) => {
      if (sealOpened) return;
      const rect = seal.getBoundingClientRect();
      const alpha = getAlphaAtPoint(alphaData, e.clientX, e.clientY, rect);
      if (alpha > 10) {
        seal.style.filter =
          "brightness(1.4) drop-shadow(0 0 4px rgba(255, 255, 255, 0.2))";
        seal.style.cursor = "pointer";
      } else {
        seal.style.filter = "";
        seal.style.cursor = "default";
      }
    });

    clone.addEventListener("click", (e) => {
      e.stopPropagation();
      if (sealOpened) return;
      const rect = seal.getBoundingClientRect();
      const alpha = getAlphaAtPoint(alphaData, e.clientX, e.clientY, rect);
      if (alpha > 10) openEnvelope();
    });

    clone.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openEnvelope();
      }
    });
  });

  function close() {
    if (!isOpen) return;
    isOpen = false;
    currentClose = null;

    clone.remove();
    letterCard.remove();
    closeBtn.remove();
    card.classList.remove("is-hidden");
    overlay.style.opacity = "0";
    overlay.style.pointerEvents = "none";
    document.body.style.overflow = "";

    card.focus();
  }

  currentClose = close;

  closeBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    close();
  });
}

cards.forEach((card) => {
  card.setAttribute("tabindex", "0");
  card.setAttribute("role", "button");
  card.setAttribute(
    "aria-label",
    `Open letter: ${card.querySelector(".bottom")?.textContent?.trim()}`,
  );

  card.addEventListener("click", () => openCard(card));

  card.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openCard(card);
    }
  });
});
