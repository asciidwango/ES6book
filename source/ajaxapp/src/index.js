function getUserInfo() {
    const userId = getUserId();

    new Promise((resolve, reject) => {
        const request = new XMLHttpRequest();
        request.open("GET", `https://api.github.com/users/${userId}`);
        request.addEventListener("load", (event) => {
            if (event.target.status !== 200) {
                reject(new Error(`${event.target.status}: ${event.target.statusText}`));
            }

            const userInfo = JSON.parse(event.target.responseText);
            resolve(userInfo);
        });
        request.addEventListener("error", () => {
            reject(new Error("ネットワークエラー"));
        });
        request.send();
    })
        .then((userInfo) => {
            try {
                return createView(userInfo);
            } catch (error) {
                throw new Error(`HTML組み立てエラー: ${error}`);
            }
        })
        .then((view) => {
            try {
                displayView(view);
            } catch (error) {
                throw new Error(`HTML表示エラー: ${error}`);
            }
        })
        .catch((error) => {
            console.error(`エラーが発生しました (${error})`);
        });
}

function getUserId() {
    return document.getElementById("userId").value;
}

function createView(userInfo) {
    return escapeHTML`
    <h4>${userInfo.name} (@${userInfo.login})</h4>
    <img src="${userInfo.avatar_url}" alt="${userInfo.login}" height="100">
    <dl>
        <dt>Location</dt>
        <dd>${userInfo.location}</dd>
        <dt>Repositries</dt>
        <dd>${userInfo.public_repos}</dd>
    </dl>
    `;
}

function displayView(view) {
    const result = document.getElementById("result");
    result.innerHTML = view;
}

function escapeSpecialChars(str) {
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function escapeHTML(strings, ...values) {
    return strings.map((part, i) => {
        const value = values[i];
        if (value) {
            if (typeof value === "string") {
                return part + escapeSpecialChars(value);
            } else {
                return part + String(value);
            }
        } else {
            return part;
        }
    }).join("");
}
