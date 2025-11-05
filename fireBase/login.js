import { auth } from "./fireBaseInit.js";
import { GoogleAuthProvider, signInWithPopup, signOut } 
  from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

const provider = new GoogleAuthProvider();
provider.setCustomParameters({ prompt: "select_account" });

document.addEventListener("DOMContentLoaded", () => {
  const googleButton = document.getElementById("googleButton");
  const loginButton = document.getElementById("loginButton");
  const logoutButton = document.getElementById("logoutButton");
  const profileImg = document.getElementById("profileImg");

  // 로그인 버튼 클릭
  if (googleButton) {
    googleButton.addEventListener("click", async () => {
      try {
        if (auth.currentUser) await signOut(auth);

        const result = await signInWithPopup(auth, provider);
        const user = result.user;

        // 로그인한 전역 저장
        window.currentUser = {
          uid: user.uid,
          displayName: user.displayName,
          photoURL: user.photoURL,
        };

        hideLoginMenu();
        showProfile(user);

        // 랭킹 화면 열려있으면 새로고침
        if (document.getElementById("ranking")?.classList.contains("active")) {
          loadRanking();
        }

      } catch (error) {
        alert("로그인에 실패했습니다: " + error.message);
      }
    });
  }

  // 로그인 유지 감지
  auth.onAuthStateChanged((user) => {
    if (user) {
      window.currentUser = {
        uid: user.uid,
        displayName: user.displayName,
        photoURL: user.photoURL,
      };
      showProfile(user);
    } else {
      window.currentUser = null;
      showLoggedOut();
    }
  });

  // 프로필 UI 반영
  function showProfile(user) {
    if (loginButton) loginButton.style.display = "none";
    if (logoutButton) logoutButton.style.display = "block";
    if (profileImg) {
      profileImg.src = user.photoURL || "images/defaultProfile.png";
      profileImg.style.display = "block";
    }
  }

  // 로그아웃
  window.logout = async function () {
    if (!confirm("정말 로그아웃하시겠습니까?")) return;

    try {
      await signOut(auth);
      window.currentUser = null;
      showLoggedOut();
      alert("로그아웃 되었습니다.");

      setTimeout(() => location.reload(), 400);

    } catch (error) {
      alert("로그아웃 실패: " + error.message);
    }
  };

  // 로그아웃 UI 반영
  function showLoggedOut() {
    if (loginButton) loginButton.style.display = "block";
    if (logoutButton) logoutButton.style.display = "none";
    if (profileImg) profileImg.style.display = "none";
  }

});
