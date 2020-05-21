$(function() {
    $("#login-form").submit(function(e) {
        e.preventDefault();
        $.ajax("/api/login", {
            method: "POST",
            data: {
                email: $("#email-input").val(),
                password: $("#password-input").val()
            }
        }).done(function(data) {
            document.cookie = `auth=${data.token};max-age=86400`;
            location.reload();
        }).fail(function(xhr) {
            let data = JSON.parse(xhr.responseText);
            let email = $("#email-input");
            let password = $("#password-input");
            switch (data.error) {
                case "INVALID_USER":
                    $("#email-feedback").text(data.message);
                    email.removeClass("is-valid");
                    email.addClass("is-invalid");
                    password.removeClass("is-invalid");
                    break;
                case "INVALID_PASSWORD":
                    $("#password-feedback").text(data.message);
                    email.removeClass("is-invalid");
                    email.addClass("is-valid");
                    password.addClass("is-invalid");
                    break;
            }
        })
    });

    $(".needs-validation").each(function() {
        $(this).submit((e) => {
           if (!this.checkValidity()) {
               e.preventDefault();
               e.stopPropagation();
           }
        })
    });
})