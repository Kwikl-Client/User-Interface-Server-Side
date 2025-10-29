// /emails/emailTemplates.js
export const emailTemplates = {
  welcomeEmail: (password) => ({
    subject: "Welcome aboard; your journey awaits.",
    text: `Welcome to your journey of self-transcendence! Your temporary password is ${password}.`,
    html: `<h1>Welcome!</h1><p>Your temporary password is <strong>${password}</strong>. Use it to log in and begin your journey!</p>`
  }),
  passwordReset: (password) => ({
    subject: "New Password",
    text: `Here's the new access key you requested: ${password}`,
    html: `<h2>Password Reset</h2><p>Your new temporary password is: <strong>${password}</strong></p>`
  }),
  passwordChanged: () => ({
    subject: "Password Change Notification",
    text: `Your password has been successfully updated.`,
    html: `<p>Your password has been successfully updated. If this wasn't you, please contact support immediately.</p>`
  }),
  bookSubscription: (url) => ({
    subject: "Greetings From Salssky",
    text: `Click the link to complete your journey: ${url}`,
    html: `<h1>Subscription Started</h1><p>Click below to complete your journey:</p><a href="${url}">${url}</a>`
  })
};
