const config = {
  apiKey: "AIzaSyCjQERD3wgFXwmqjmioJgknqqatHBOLHE0",
  authDomain: "pc-lens.firebaseapp.com",
  databaseURL: "https://pc-lens.firebaseio.com",
  projectId: "pc-lens",
  storageBucket: "pc-lens.appspot.com",
  messagingSenderId: "437105965614"
};
firebase.initializeApp(config);

var db = firebase.firestore();
const settings = { timestampsInSnapshots: true };
db.settings(settings);

getParseURL = address => {
  let parse = address
    .replace(/\s+/g, "")
    .replace("http://", "")
    .replace("https://", "")
    .replace(/\/$/, "");
  let deleteString;
  let resultUrl;
  if (parse.indexOf("?") >= 0) {
    deleteString = parse.substring(parse.indexOf("?"), parse.length);
    resultUrl = parse.replace(deleteString, "");
  } else {
    resultUrl = parse;
  }
  return resultUrl;
};

viewComment = (comment, color, size) => {
  let weight = size == "60px" ? "bold" : "normal";
  let css = {
    color: color,
    "font-weight": weight,
    "font-size": size,
    margin: 0,
    padding: 0,
    position: "fixed",
    overflow: "visible",
    "background-color": "transparent",
    "line-height": 1,
    "white-space": "nowrap",
    "user-select": "none",
    "-webkit-user-select": "none"
  };
  if (comment == null) {
    return;
  }

  let htmlDiv = $("<div>")
    .css(css)
    .text(comment)
    .hide()
    .appendTo("body");

  let width = document.documentElement.clientWidth;
  let height = document.documentElement.clientHeight;
  let pageWidth = htmlDiv.width();
  let pageHeight = htmlDiv.height();

  let top = parseInt(Math.random() * (height - 100));
  for (let i = 0; i < 10; i++) {
    if (top + 20 >= oldTopRandom && top - 20 <= oldTopRandom) {
      //前回から上下20以内の変動だとコメントの位置が被るので再度乱数生成
      top = parseInt(Math.random() * (height - 100));
    } else {
      break;
    }
  }
  oldTopRandom = top; //乱数の被りがなくなったので記録
  console.log(top);

  let speed = 5000 + width - 30 * comment.length;
  if (speed <= 0) speed = 3000;

  htmlDiv.css({ left: width, top: top });
  htmlDiv.show().animate(
    {
      left: -pageWidth
    },
    {
      duration: speed,
      easing: "linear",
      complete: function() {
        $(this).remove();
      }
    }
  );
};

escape = content => {
  return content
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
};

var scroll = 0;
var url = null;
var comments = {};
var ids = [];
var currentURL = getParseURL(location.href);
var oldTopRandom = 0;

db.collection("pclens")
  .where("url", "==", currentURL)
  .onSnapshot(snapshot => {
    snapshot.docChanges().forEach(change => {
      if (change.type === "added") {
        console.log(change.doc.data());
        comments[change.doc.id] = {
          comment: escape(change.doc.data().comment),
          scroll: change.doc.data().scroll,
          color: change.doc.data().color,
          size: change.doc.data().size,
          name: change.doc.data().name,
          url: change.doc.data().url
        };
        ids.push(change.doc.id);
      }
      if (change.doc.data().scroll <= scroll) {
        viewComment(
          escape(change.doc.data().comment),
          change.doc.data().color,
          change.doc.data().size
        );
      }
    });
  });

window.addEventListener(
  "mousewheel",
  function(e) {
    let nowScroll = Math.round(window.pageYOffset / 100) * 100;
    //前回と同じスクロール量の場合（微差のスクロール）はコメント表示の重複を防ぐため反応しない
    if (scroll === nowScroll) {
      return 0;
    } else if (nowScroll - scroll >= 200) {
      //200以上スクロールした場合にコメントの取り損ないを阻止
      for (id of ids) {
        if (
          nowScroll > Math.round(comments[id].scroll / 100) * 100 &&
          scroll < Math.round(comments[id].scroll / 100) * 100
        ) {
          console.log(comments[id]);
          viewComment(
            comments[id].comment,
            comments[id].color,
            comments[id].size
          );
        }
      }
    }
    scroll = nowScroll;
    console.log("スクロール量でえええええｓ" + scroll);
    for (id of ids) {
      if (scroll === Math.round(comments[id].scroll / 100) * 100) {
        console.log(comments[id]);
        viewComment(
          comments[id].comment,
          comments[id].color,
          comments[id].size
        );
      }
    }
    chrome.runtime.sendMessage(
      { scrollLevel: scroll, currentURL: currentURL },
      response => {
        console.log("message sent");
      }
    );
  },
  false
);
