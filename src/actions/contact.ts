'use server'

export async function sendContact(formData: FormData) {
    const name = formData.get('name') as string
    const email = formData.get('email') as string
    const emailConfirm = formData.get('emailConfirm') as string
    const message = formData.get('message') as string

    // Validation
    if (!name || !email || !emailConfirm || !message) {
        return { error: 'すべての項目を入力してください' }
    }

    if (email !== emailConfirm) {
        return { error: 'メールアドレスが一致しません' }
    }

    // Simulate Email Sending (Log to Console)
    console.log('--- START: CONTACT FORM SUBMISSION ---')
    console.log(`To: ${email}`) // Auto-reply
    console.log(`Subject: 【WALLABY FACTORY】お問い合わせありがとうございます`)
    console.log(`Body:`)
    console.log(`${name} 様`)
    console.log(`この度はお問い合わせいただきありがとうございます。`)
    console.log(`以下の内容で承りました。`)
    console.log(`--------------------------------------------------`)
    console.log(message)
    console.log(`--------------------------------------------------`)
    console.log(`担当者より順次ご返信いたします。今しばらくお待ちください。`)
    console.log('--- END: CONTACT FORM SUBMISSION ---')

    // Also simulate admin notification
    console.log('--- ADMIN NOTIFICATION ---')
    console.log(`New Inquiry from: ${name} <${email}>`)
    console.log(`Message: ${message}`)
    console.log('--------------------------')

    // Wait to simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    return { success: true }
}
