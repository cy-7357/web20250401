//選單一定要有以下設定
{/* <span class="h5 me-3 d-none align-content-center" id="s02_username_showtext" style="color: var(--bgcolor03);">
    歡迎會員: <span class="h4 fw-900" style="color: var(--bgcolor02);" id="s02_username_text">XXX</span></span>
<button class="btn bg-02 d-none tx-03" id="s02_logout_btn">登出</button> */}

// $ : 可能導致載入判斷錯誤
(function () {

    //監聽按鈕s02_logout_btn
    $("#s02_logout_btn").click(function () {
        setCookie("Uid01", "", 7);
        location.href = "SPA-index_v1.html";
    });

    function setCookie(cname, cvalue, exdays) {
        const d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        let expires = "expires=" + d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }

    // W3C
    function getCookie(cname) {
        let name = cname + "=";
        let ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }

    // 檢查uid是否存在, 若沒有則導向登入
    if (!getCookie("Uid01")) {
        Swal.fire({
            title: "請先登入會員!",
            showDenyButton: false,
            showCancelButton: false,
            confirmButtonText: "確認",
            allowOutsideClick: false,
            denyButtonText: `Don't save`
        }).then((result) => {
            if (result.isConfirmed) {
                location.href = "SPA-index_v1.html";
            }
        });
        // return : 不帶任何東西即為終止
        return;
    }

    // 若uid存在, 傳遞至後端API執行驗證
    var JSONdata = {};
    JSONdata["uid01"] = getCookie("Uid01");
    // console.log(JSON.stringify(JSONdata));
    $.ajax({
        type: "POST",
        url: "member_control_api_v1.php?action=checkuid",
        data: JSON.stringify(JSONdata),
        dataType: "json",
        success: function (data) {
            if (data.state) {
                //顯示歡迎訊息
                $("#s02_username_showtext").removeClass("d-none");
                $("#s02_username_text").text(data.data.Username);

                //顯示登出按鈕
                $("#s02_logout_btn").removeClass("d-none");
            } else {
                Swal.fire({
                    title: "請先登入會員!",
                    showDenyButton: false,
                    showCancelButton: false,
                    confirmButtonText: "確認",
                    allowOutsideClick: false,
                    denyButtonText: `Don't save`
                }).then((result) => {
                    if (result.isConfirmed) {
                        location.href = "SPA-index_v1.html";
                    }
                });
            }
        },
        error: function () {
            Swal.fire({
                title: "API 介接錯誤",
                text: "member_control_api_v1.php",
                icon: "error",
                allowOutsideClick: false,
            });
        }
    });

})();