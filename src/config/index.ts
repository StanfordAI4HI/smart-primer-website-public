let previousResponseIndex = 0;

export const idleResponses = [
  "Remember, you can chat with me if you’re stuck, so we can come up with ideas together!",
  "You can ask me for help!",
  "Don't worry. I've got you!",
  "How are you doing? Remember, chat with me if you want to brainstorm together!",
  "Are you still there? Let me know if you want to talk the problem through with me!",
  "Remember that I’m always here if you need help!",
  "Let me know if you need anything. I can help you with the problem!",
  "This isn’t a solo mission. Let me know if you need any help!",
  "I want to help, too! Ask me if you need a hint.",
  "I’ve got your back. Send me a message if you want to brainstorm.",
  "This one’s tough, right? If you want some pointers, just ask!",
  "Don’t forget that I’m always here to help, just let me know!",
  "If you’re stuck, maybe I can help. Ask me anything you need.",
  "I’m always here if you need help. Ask away!",
  "Be sure to let me know if you’re confused. I’ll do my best to get you unstuck!",
  "Don’t forget about me! I can give you some pointers, if you just ask.",
  "I think I’ve seen a problem like this before. If you need it, I may be able to help.",
  "I think I have some ideas! But I won’t spoil it. Just let me know if you need a hint.",
  "Feel free to ask me for help, if you don’t know how to do it. I’m an open book!",
  "I think you’ve got this. But if you need help, just let me know!",
];

export const getIdleResponse = () => {
  const r = [...idleResponses];
  r.splice(previousResponseIndex, 1);

  const response = r[Math.floor(Math.random() * r.length)];
  previousResponseIndex = idleResponses.indexOf(response);

  return response;
};

export const IDLE_INTERVAL = 120 * 1000;
