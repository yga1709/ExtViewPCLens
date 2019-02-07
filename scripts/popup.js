var bg = chrome.extension.getBackgroundPage();

main = () => {
  userAuth();
  let scrollLevel = bg.scrollLevel;
  let currentURL = bg.currentURL;
  let mode = bg.mode;
  let modeStr = "";
  if (mode) {
    modeStr = "on";
  } else {
    modeStr = "off";
  }
  let showMessage = `URL:${currentURL} <br>数値:${scrollLevel} mode:${modeStr}`;
  document.getElementById("view").insertAdjacentHTML("afterbegin", showMessage);
  //console.log(showMessage);
};

document.getElementById("TrueExtSwc").onclick = () => {
  chrome.storage.local.set({ ext: true }, data => {
    //console.log("ONにしました");
  });
};

document.getElementById("FalseExtSwc").onclick = () => {
  chrome.storage.local.set({ ext: false }, function() {
    //console.log("OFFにします");
  });
};

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
var isAnonymous;
var uid;
var oldSendTIme = null;

userAuth = () => {
  firebase
    .auth()
    .signInAnonymously()
    .catch(error => {
      // Handle Errors here.
      let errorCode = error.code;
      let errorMessage = error.message;
      // ...
      console.log(errorCode, errorMessage);
    });

  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      // User is signed in.
      isAnonymous = user.isAnonymous;
      uid = user.uid;
      // ...
    }
  });
};

window.onload = () => {
  main();
  const url = document.getElementById("url");
  url.value = bg.currentURL;
  const userPosition = document.getElementById("posiNum");
  userPosition.value = Math.round(Number(bg.scrollLevel) / 10) * 10;
};

document.getElementById("send").onclick = () => {
  if (!isAnonymous) {
    return 0;
  }
  const viewTime = getTime();
  const name = document.getElementById("name").value;
  const comment = document.getElementById("comment").value;
  const url = document.getElementById("url").value;
  const getColor = document.getElementById("color");
  const getSize = document.getElementById("size");
  const userPosition = document.getElementById("posiNum").value;
  const color = getColor.colorList.value;
  const size = getSize.sizeList.value;

  if (!errorCheck(name, comment, url)) {
    return 0;
  }

  db.collection("pclens")
    .add({
      name: name,
      comment: comment,
      url: url,
      color: color,
      size: size,
      scroll: userPosition,
      userID: uid,
      viewTime: viewTime,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    })
    .then(function(docRef) {
      console.log(name, comment, url, color, size, scroll, position, uid);
      resultMessage(true, "送信が完了しました。");
      let sendDate = new Date();
      oldSendTIme = sendDate.getTime();
      document.getElementById("comment").value = "";
    })
    .catch(function(error) {
      console.error("Error adding document: ", error);
      resultMessage(false, error);
    });
};

errorCheck = (name, comment, url) => {
  if (oldSendTIme != null && !checkInterval()) {
    resultMessage(false, "連続してコメントできません。10秒お待ちください。");
    return false;
  }
  if (name === "" || comment === "" || url === "") {
    resultMessage(false, "必要事項が入力されていません。");
    return false;
  }
  if (url === "pc-lens.firebaseapp.com") {
    resultMessage(false, "コメント投稿サイトに直接コメントできません。");
    return false;
  }
  if (comment.length >= 140) {
    resultMessage(false, "コメントが長すぎます。（制限：140字以下）");
    return false;
  }
  if (name.length >= 20) {
    resultMessage(
      false,
      "名前が長すぎます。本名が長い方はニックネームを利用してください。"
    );
    return false;
  }
  if (/殺|ころす|死|4ね|しね|fuck|キャトルミューティレーション/.test(comment)) {
    resultMessage(false, "表示できない単語が含まれています。");
    return false;
  }
  return true;
};

resultMessage = (check, message) => {
  const resultMsg = document.getElementById("result");
  if (check) {
    let html = `
    <div v-if="success" class="uk-alert-success" uk-alert>
      <a class="uk-alert-close" uk-close></a>
      <p>${message}</p>
    </div>`;
    resultMsg.textContent = "";
    resultMsg.insertAdjacentHTML("afterbegin", html);
  } else {
    let html = `<div v-else="error" class="uk-alert-danger" uk-alert>
      <a class="uk-alert-close" uk-close></a>
     <p>${message}</p>
    </div>`;
    resultMsg.textContent = "";
    resultMsg.insertAdjacentHTML("afterbegin", html);
  }
};

parseUrl = address => {
  let parse = address
    .replace(/\s+/g, "")
    .replace("http://", "")
    .replace("https://", "")
    .replace(/\/$/, "")
    .replace(";", "");
  return parse;
};

checkInterval = () => {
  let now = new Date();
  let newSendTime = now.getTime();
  let diff = newSendTime - oldSendTIme;
  const diffSecond = Math.floor(diff / 1000);
  if (diffSecond >= 10) {
    return true;
  } else {
    return false;
  }
};

getTime = () => {
  const data = new Date();
  //時・分・秒を取得する
  const hour = data.getHours();
  const minute = data.getMinutes();
  const second = data.getSeconds();

  //年・月・日・曜日を取得する
  const time = new Date();
  const year = time.getFullYear();
  const month = time.getMonth() + 1;
  const day = time.getDate();

  const fileStamp = `${year}年${month}月${day}日${hour}時${minute}分${second}秒`;
  return fileStamp;
};
