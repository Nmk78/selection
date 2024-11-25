import CandidateSelection from "@/components/CandidateCardContainer";
import Carousel from "@/components/Carousel";
import Footer from "@/components/Footer";

export default function Home() {

  const imgs = [
    '/myat.jpg',
    '/myat1.jpg',
    '/myat.jpg',
    '/myat1.jpg',
    '/myat.jpg',
    '/myat1.jpg'
  ];
  return (
    <div className="space-y-4 max-w-7xl">
      <Carousel images={imgs}/>

      <a href="/results" id="results" className="block text-Caccent font-quindelia text-2xl text-center mx-auto">
        Check results
      </a>
      <div id="disclaimer" className=" px-3 py-1">
        <h2 className="text-Cprimary text-center font-bold text-3xl font-quindelia">Disclaimer</h2>
        <div className="border p-2 border-Csecondary rounded-lg">
        <p className=" text-Cprimary text-lg text-center font-quindelia">According to the program's giuideline it's important to note that once your vote is cast, modifications are not allowed. Ensuring the accuracy of your choice before finalizing your vote is crucial. Your cooperation in adhering to these regulations is greatly valued. Thank you for your understanding and commitment to the voting process.</p>
        </div>
      </div>

      <CandidateSelection/>

      <Footer/>
    </div>
  );
}
