import { UploadForm } from "@/components/seller/upload/UploadForm"

export const metadata = {
  title: "Upload New Product | Designr",
  description: "List your premium design assets on our marketplace."
}

export default function UploadPage() {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2 mb-12">
        <h1 className="text-4xl font-black tracking-tight text-white">
          List your masterpiece<span className="text-amber-400">.</span>
        </h1>
        <p className="text-white/40 font-medium">Follow the steps to get your work live and selling.</p>
      </div>

      <UploadForm />
    </div>
  )
}
