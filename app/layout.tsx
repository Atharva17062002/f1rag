import "./global.css"
export const metadata = {
    title : "F1rag",
    description : "Place for all your formula one answers"
}

const RootLayout = ({children}) => {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    )
}

export default RootLayout