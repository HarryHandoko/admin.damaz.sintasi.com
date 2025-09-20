import Pusher from "pusher-js";

export default defineNuxtPlugin(() => {
  const pusher = new Pusher("2222bbf0d0069f56342b", {
    cluster: "ap1",
  });

  return {
    provide: {
      pusher,
    },
  };
});
