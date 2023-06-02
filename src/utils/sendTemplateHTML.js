const sendTemplateHTML = (name, url, verificationToken, email) => {
  return `<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f7f7f7;
            margin: 0;
            padding: 0;
        }

        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }

        .header {
            text-align: center;
            margin-bottom: 20px;
        }

        .logo {
            width: 150px;
        }

        .content {
            background-color: #ffffff;
            border-radius: 5px;
            padding: 30px;
        }

        .content h1 {
            font-size: 24px;
            margin-bottom: 20px;
        }

        .content p {
            font-size: 16px;
            margin-bottom: 30px;
        }

        .button {
            display: inline-block;
            background-color: #4CAF50;
            color: #ffffff;
            text-decoration: none;
            padding: 10px 20px;
            border-radius: 3px;
            font-size: 16px;
        }
    </style>
</head>

<body>
    <div class="container">
        <div class="content">
            <h1>Hello, ${name}!</h1>
            <p>Please click on the button below to verify your email:</p>
            <a href="${url}/auth/verify-email?verificationToken=${verificationToken}&email=${email}" class="button">Verify Email</a>
        </div>
    </div>
</body>

</html> `;
};

module.exports = sendTemplateHTML;
