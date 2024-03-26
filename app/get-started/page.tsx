import { SiteForm } from "@/components/site-form";

const GetStartedPage = () => {
    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <div className="z-10 max-w-5xl w-full items-center justify-center lg:flex space-y-4">
                <SiteForm />
            </div>
        </main>
    )
}

export default GetStartedPage;