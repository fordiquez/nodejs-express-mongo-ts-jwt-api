import { createTransport, SentMessageInfo, Transporter } from 'nodemailer';
import validateEnv from './validateEnv.js';

export default class Nodemailer {
    private transporter: Transporter<SentMessageInfo>;
    private appName = 'Nodemailer';
    private appUrl: string | undefined;

    constructor() {
        const { MAIL_HOST, MAIL_PORT, MAIL_USERNAME, MAIL_PASSWORD } = validateEnv();

        this.transporter = createTransport({
            host: MAIL_HOST,
            port: MAIL_PORT,
            auth: {
                user: MAIL_USERNAME,
                pass: MAIL_PASSWORD,
            },
        });
    }

    private sendMail = async (
        to: string,
        subject: string,
        subtitle: string,
        message: string | null = null,
        from: string | null = null,
    ): Promise<void> => {
        const { MAIL_FROM_ADDRESS } = validateEnv();

        const html = this.layout(subject, subtitle, message);

        await this.transporter.sendMail({ to, from: from ?? MAIL_FROM_ADDRESS, subject, html });
    };

    public sendResetPasswordMail = async (email: string, token: string, origin: string | undefined): Promise<void> => {
        this.appUrl = origin;
        const subtitle = origin
            ? 'Please click the below link to reset your password. The link will be valid for 1 day'
            : `Please use the below token to reset your password with the <code>/reset-password</code> api route`;
        const url = `${origin}/auth/reset-password?token=${token}`;
        const resetPasswordLink = `<div style="text-align: center; margin: 20px 0">
              <a href="${url}" target="_blank" style="display: inline-block; padding: 10px 15px; font-size: 14px; border-radius: 50px; color: #003737; background: #0feb73; text-transform: uppercase; text-decoration: none; font-weight: bold">
                Reset Password
              </a>
          </div>`;
        const message = origin ? resetPasswordLink : `<code style="word-break: break-all">${token}</code>`;
        await this.sendMail(email, 'Reset Password', subtitle, message);
    };

    private styles = (): string => `@media only screen and (max-width: 600px) {
.inner-body {
width: 100% !important;
}

.footer {
width: 100% !important;
}
}

@media only screen and (max-width: 500px) {
.button {
width: 100% !important;
}
}

/* Base */

body,
body *:not(html):not(style):not(br):not(tr):not(code) {
    box-sizing: border-box;
    position: relative;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';
}

body {
    -webkit-text-size-adjust: none;
    background-color: #ffffff;
    color: #718096;
    height: 100%;
    line-height: 1.4;
    margin: 0;
    padding: 0;
    width: 100% !important;
}

p,
ul,
ol,
blockquote {
    line-height: 1.4;
    text-align: left;
}

a {
    color: #3869d4;
}

a img {
    border: none;
}

/* Typography */

h1 {
    color: #3d4852;
    font-size: 18px;
    font-weight: bold;
    margin-top: 0;
    text-align: left;
}

h2 {
    font-size: 16px;
    font-weight: bold;
    margin-top: 0;
    text-align: left;
}

h3 {
    font-size: 14px;
    font-weight: bold;
    margin-top: 0;
    text-align: left;
}

p {
    font-size: 16px;
    line-height: 1.5em;
    margin-top: 0;
    text-align: left;
}

p.sub {
    font-size: 12px;
}

img {
    max-width: 100%;
}

/* Layout */

.wrapper {
    -premailer-cellpadding: 0;
    -premailer-cellspacing: 0;
    -premailer-width: 100%;
    background-color: #edf2f7;
    margin: 0;
    padding: 0;
    width: 100%;
}

.content {
    -premailer-cellpadding: 0;
    -premailer-cellspacing: 0;
    -premailer-width: 100%;
    margin: 0;
    padding: 0;
    width: 100%;
}

/* Header */

.header {
    padding: 25px 0;
    text-align: center;
}

.header a {
    color: #3d4852;
    font-size: 19px;
    font-weight: bold;
    text-decoration: none;
}

/* Logo */

.logo {
    height: 75px;
    max-height: 75px;
    width: 75px;
}

/* Body */

.body {
    -premailer-cellpadding: 0;
    -premailer-cellspacing: 0;
    -premailer-width: 100%;
    background-color: #edf2f7;
    border-bottom: 1px solid #edf2f7;
    border-top: 1px solid #edf2f7;
    margin: 0;
    padding: 0;
    width: 100%;
}

.inner-body {
    -premailer-cellpadding: 0;
    -premailer-cellspacing: 0;
    -premailer-width: 570px;
    background-color: #ffffff;
    border-color: #e8e5ef;
    border-radius: 2px;
    border-width: 1px;
    box-shadow: 0 2px 0 rgba(0, 0, 150, 0.025), 2px 4px 0 rgba(0, 0, 150, 0.015);
    margin: 0 auto;
    padding: 0;
    width: 570px;
}

/* Subcopy */

.subcopy {
    border-top: 1px solid #e8e5ef;
    margin-top: 25px;
    padding-top: 25px;
}

.subcopy p {
    font-size: 14px;
}

/* Footer */

.footer {
    -premailer-cellpadding: 0;
    -premailer-cellspacing: 0;
    -premailer-width: 570px;
    margin: 0 auto;
    padding: 0;
    text-align: center;
    width: 570px;
}

.footer p {
    color: #b0adc5;
    font-size: 12px;
    text-align: center;
}

.footer a {
    color: #b0adc5;
    text-decoration: underline;
}

/* Tables */

.table table {
    -premailer-cellpadding: 0;
    -premailer-cellspacing: 0;
    -premailer-width: 100%;
    margin: 30px auto;
    width: 100%;
}

.table th {
    border-bottom: 1px solid #edeff2;
    margin: 0;
    padding-bottom: 8px;
}

.table td {
    color: #74787e;
    font-size: 15px;
    line-height: 18px;
    margin: 0;
    padding: 10px 0;
}

.content-cell {
    max-width: 100vw;
    padding: 32px;
}

/* Buttons */

.action {
    -premailer-cellpadding: 0;
    -premailer-cellspacing: 0;
    -premailer-width: 100%;
    margin: 30px auto;
    padding: 0;
    text-align: center;
    width: 100%;
}

.button {
    -webkit-text-size-adjust: none;
    border-radius: 4px;
    color: #fff;
    display: inline-block;
    overflow: hidden;
    text-decoration: none;
}

.button-blue,
.button-primary {
    background-color: #2d3748;
    border-bottom: 8px solid #2d3748;
    border-left: 18px solid #2d3748;
    border-right: 18px solid #2d3748;
    border-top: 8px solid #2d3748;
}

.button-green,
.button-success {
    background-color: #48bb78;
    border-bottom: 8px solid #48bb78;
    border-left: 18px solid #48bb78;
    border-right: 18px solid #48bb78;
    border-top: 8px solid #48bb78;
}

.button-red,
.button-error {
    background-color: #e53e3e;
    border-bottom: 8px solid #e53e3e;
    border-left: 18px solid #e53e3e;
    border-right: 18px solid #e53e3e;
    border-top: 8px solid #e53e3e;
}

/* Panels */

.panel {
    border-left: #2d3748 solid 4px;
    margin: 21px 0;
}

.panel-content {
    background-color: #edf2f7;
    color: #718096;
    padding: 16px;
}

.panel-content p {
    color: #718096;
}

.panel-item {
    padding: 0;
}

.panel-item p:last-of-type {
    margin-bottom: 0;
    padding-bottom: 0;
}

/* Utilities */

.break-all {
    word-break: break-all;
}
`;

    private layout = (title: string, subtitle: string, message: string | null): string => {
        return `<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head>
<title>${this.appName}</title>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta name="color-scheme" content="light">
<meta name="supported-color-schemes" content="light">
<style>${this.styles()}</style>
</head>
<body style="-webkit-text-size-adjust: none; background-color: #ffffff; color: #718096; height: 100%; line-height: 1.4; margin: 0; padding: 0; width: 100% !important;">

<table class="wrapper" width="100%" cellpadding="0" cellspacing="0" role="presentation" style="-premailer-cellpadding: 0; -premailer-cellspacing: 0; -premailer-width: 100%; background-color: #edf2f7; margin: 0; padding: 0; width: 100%;">
<tbody><tr>
<td align="center">
<table class="content" width="100%" cellpadding="0" cellspacing="0" role="presentation" style="-premailer-cellpadding: 0; -premailer-cellspacing: 0; -premailer-width: 100%; margin: 0; padding: 0; width: 100%;">
<tbody><tr>
<td class="header" style="padding: 25px 0; text-align: center;">
${
    this.appUrl
        ? `<a target="_blank" rel="noopener noreferrer" href="${this.appUrl}" style="color: #3d4852; font-size: 19px; font-weight: bold; text-decoration: none; display: inline-block;">
${this.appName}
</a>`
        : ''
}
</td>
</tr>

<!-- Email Body -->
<tr>
<td class="body" width="100%" cellpadding="0" cellspacing="0" style="-premailer-cellpadding: 0; -premailer-cellspacing: 0; -premailer-width: 100%; background-color: #edf2f7; border-bottom: 1px solid #edf2f7; border-top: 1px solid #edf2f7; margin: 0; padding: 0; width: 100%; border: hidden !important;">
<table class="inner-body" align="center" width="570" cellpadding="0" cellspacing="0" role="presentation" style="-premailer-cellpadding: 0; -premailer-cellspacing: 0; -premailer-width: 570px; background-color: #ffffff; border-color: #e8e5ef; border-radius: 2px; border-width: 1px; box-shadow: 0 2px 0 rgba(0, 0, 150, 0.025), 2px 4px 0 rgba(0, 0, 150, 0.015); margin: 0 auto; padding: 0; width: 570px;">
<!-- Body content -->
<tbody><tr>
<td class="content-cell" style="max-width: 100vw; padding: 32px;">
<h1 style="color: #3d4852; font-size: 18px; font-weight: bold; margin-top: 0; text-align: left;">${title}</h1>
<h2 style="font-size: 16px; font-weight: bold; margin-top: 0; text-align: left;">${subtitle}</h2>
${message ? `<p style="font-size: 16px; line-height: 1.5em; margin-top: 0; text-align: left;">${message}</p>` : ''}
<p style="font-size: 16px; line-height: 1.5em; margin-top: 0; text-align: left;"><em>Best regards,<br>${
            this.appName
        }</em></p>
</td>
</tr>
</tbody>
</table>
</td>
</tr>

<tr>
<td>
<table class="footer" align="center" width="570" cellpadding="0" cellspacing="0" role="presentation" style="-premailer-cellpadding: 0; -premailer-cellspacing: 0; -premailer-width: 570px; margin: 0 auto; padding: 0; text-align: center; width: 570px;">
<tbody><tr>
<td class="content-cell" align="center" style="max-width: 100vw; padding: 32px;">
<p style="line-height: 1.5em; margin-top: 0; color: #b0adc5; font-size: 12px; text-align: center;">© ${new Date().getFullYear()} ${
            this.appName
        }. All rights reserved.</p>

</td>
</tr>
</tbody></table>
</td>
</tr>
</tbody></table>
</td>
</tr>
</tbody></table>

</body></html>`;
    };
}
