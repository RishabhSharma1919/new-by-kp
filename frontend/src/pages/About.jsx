import Title from "../components/Title";
import { assets } from "../assets/assets";
import NewsletterBox from "../components/NewsletterBox";

const About = () => {
  return (
    <div className="relative bg-transparent px-6 sm:px-12 py-6">
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/30 -z-10"></div>

      {/* Title Section with Increased Font Size */}
      <div className="text-center text-4xl md:text-5xl  pt-8 ">
        <Title text1="ABOUT" text2="US" className="text-5xl md:text-6xl" />
      </div>

      {/* About Us Content */}
      <div className="my-10 flex flex-col md:flex-row gap-16 text-white">
        {/* Framed Image */}
        <div className="relative w-full md:max-w-[450px]">
          <div className="border-4 border-gray-300 shadow-lg rounded-lg overflow-hidden p-2">
            <img
              src={assets.aboutus2}
              className="w-full h-auto rounded-md"
              alt="A welcoming atmosphere showcasing artwork at ARTNART"
            />
          </div>
        </div>

        {/* About Content */}
        <div className="flex flex-col justify-center gap-6 md:w-2/4">
          <p className="text-lg leading-relaxed drop-shadow-md">
            Welcome to <b>ARTNART</b>, where creativity meets craftsmanship. We are passionate about curating and delivering the finest collection of artistic pieces that celebrate the beauty and diversity of art.
          </p>
          <p className="text-lg leading-relaxed drop-shadow-md">
            At the heart of our journey lies a deep appreciation for traditional and contemporary art forms. Our platform connects skilled artists with those who admire and cherish their work, offering a space where art finds its rightful home.
          </p>

          <b className="text-gray-200 text-xl">Our Mission</b>
          <p className="text-lg leading-relaxed drop-shadow-md">
            Our mission is to make art accessible while supporting talented artists worldwide. We strive to create a space where creativity flourishes, enabling artists to share their stories and craft with the world.
          </p>
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div className="text-center text-white text-2xl font-semibold py-6">
        <Title text1="WHY" text2="CHOOSE US" className="text-white drop-shadow-md" />
      </div>

      {/* Flip Cards (Only Front Side Displays Content) */}
      <div className="flex flex-col md:flex-row justify-center items-center gap-8 mb-20">
        {[
          "Quality Assurance",
          "Convenience",
          "Exceptional Customer Service",
        ].map((text, index) => (
          <div key={index} className="group relative w-80 h-44 perspective-1000">
            {/* Flip Container */}
            <div className="relative w-full h-full transition-transform duration-700 transform-style-3d group-hover:rotate-y-180">
              
              {/* Front Side with Text */}
              <div className="absolute inset-0 flex items-center justify-center bg-white/10 backdrop-blur-md shadow-md rounded-lg p-6 text-xl font-semibold border border-white/20 backface-hidden">
                {text}
              </div>

              {/* Back Side with Mirrored Text Only (No Content) */}
              <div className="absolute inset-0 flex items-center justify-center bg-gray-800 text-white rounded-lg p-6 shadow-md rotate-y-180 backface-hidden">
                <p className="text-xl font-semibold transform scale-y-[-1] opacity-10 select-none">
                  {text}
                </p>
              </div>

            </div>
          </div>
        ))}
      </div>

      {/* Newsletter Section */}
      <div className="mt-12">
        <NewsletterBox />
      </div>
    </div>
  );
};

export default About;
