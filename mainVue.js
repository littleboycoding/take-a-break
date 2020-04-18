Vue.component("text-box", {
  props: ["notification"],
  template:
    "<div class='text'><slot></slot><br/><br/><warning :notification='notification'></warning></div>",
});

Vue.component("warning", {
  props: ["notification"],
  template:
    "<span class='warning' v-if='notificationDenied'>We can't notify you because you aren't allow us to, Please change setting if you change your mind.</span>",
  computed: {
    notificationDenied() {
      return this.notification === "denied" ? true : false;
    },
  },
});

Vue.component("help-text", {
  data() {
    return {
      help: [],
    };
  },
  async created() {
    let helpText = await fetch("helpText.txt").then((res) => res.text());
    this.help = helpText.split("\n");
  },
  computed: {
    randomComputed() {
      const randomIndex = Math.floor(Math.random() * (this.help.length - 0.1));
      return this.help[randomIndex];
    },
  },
  template: '<span style="font-size: 2vw">> {{randomComputed}}</span>',
});

let vm = new Vue({
  el: "#app",
  async mounted() {
    //assume that 1000 ms = 1 min for now...
    const ms = 1000; //60000 = 1 min
    if (!"Notification" in window) {
      alert(
        "Your browser doesn't not supported notification, So we can't send notify to you."
      );
    } else if (
      Notification.permission !== "granted" &&
      Notification.permission !== "denied"
    ) {
      await Notification.requestPermission();
    }
    this.notificationState = Notification.permission;
    setInterval(this.timeForward, ms);
  },
  data: {
    timer: 0, //minute
    alreadyNotify: false, //prevent notification to appear more than one
    timeLimit: 5,
    fetchedGif: {},
    notificationState: "",
  },
  methods: {
    async timeForward() {
      if (this.timer < this.timeLimit) {
        this.timer += 1;
      } else if (!this.alreadyNotify && Notification.permission === "granted") {
        this.alreadyNotify = true;

        //Get random lovely cat picture from thecatapi
        const catapi = `https://api.thecatapi.com/v1/images/search`;
        this.fetchedGif = await fetch(catapi)
          .then((res) => res.json())
          .catch(() => "error");

        if ("active" in registration) {
          registration.active.postMessage({
            action: "notification",
            title: "Take a Break",
            image: this.fetchedGif !== "error" ? this.fetchedGif[0]["url"] : "",
            body: `You have sat for ${this.timeLimit} mintues ! Get up take some break 🎉`,
          });
        }
      }
    },
    timeReset() {
      this.timer = 0;
      this.alreadyNotify = false;
    },
  },
  computed: {
    isTime() {
      return this.timer == this.timeLimit ? true : false;
    },
  },
});
