import Image from "next/image";
import Link from "next/link";
const DownloadApp = () => {
  return (
    <section
      className="specialization-list py-[40px] wow animate__fadeInDown"
      data-wow-duration="1500ms"
      data-wow-delay="0.15s"
      // style={{
      //   background:
      //     "linear-gradient(88.66deg, rgb(255, 255, 255) 1.08%, rgb(210 224 223) 26.56%, rgb(251, 251, 251) 76.5%, rgb(251, 251, 251) 98.92%)",
      // }}
      style={{
        background:
          "linear-gradient(88.66deg, rgb(232 241 240) 1.08%, rgb(182 215 212) 26.56%, rgb(251 251 251) 76.5%, rgb(251, 251, 251) 98.92%)",
      }}
    >
      <div className="container mx-auto px-6">
        <div className="flex flex-wrap items-center">
          <div className="w-full md:w-1/2 p-6">
            <img
              className="mx-auto"
              src="/images/feedback-fifteen.png"
              alt="App Showcase"
              height={700}
              width={700}
            />
          </div>

          <div className="w-full md:w-1/2 text-center p-6 wow animate__pulse">
            <h2 className="text-3xl md:text-4xl font-semibold text-gray-800 mb-4">
              Download The Cliniify App Today!
            </h2>
            <p className="text-lg text-gray-600 mb-4">
              Empowering Your Health Journey with Cliniify - Simplifying
              Healthcare for a Healthier Tomorrow.
            </p>

            <div className="flex justify-center mb-3">
              <div className="w-20 h-20 overflow-hidden shadow-lg">
                <a href="#">
                  <Image
                    src="/images/qr-code.png"
                    alt=""
                    height={80}
                    width={80}
                  />
                </a>
              </div>
            </div>
            <p className="text-lg text-gray-600 mb-6">
              Scan the QR code to get the app now
            </p>
            <div className="flex flex-wrap justify-center mt-6 -m-2.5">
              <div className="w-auto p-1">
                <a href="https://apps.apple.com/in/app/cliniify-pro/id6621213218">
                  <Image
                    src="/images/ios-app.png"
                    alt=""
                    height={200}
                    width={180}
                  />
                </a>
              </div>
              <div className="w-auto p-1">
                <a href="https://play.google.com/store/apps/details?id=com.iconic.cliniifypro&pcampaignid=web_share">
                  <Image
                    src="/images/google-app.png"
                    alt=""
                    height={200}
                    width={180}
                  />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default DownloadApp;
