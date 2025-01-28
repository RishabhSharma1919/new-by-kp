import Title from "../components/Title";

import { assets } from "../assets/assets";
import NewsletterBox from "../components/NewsletterBox";

const About = () => {
  return (
    <div>
      <div className="text-2xl text-center pt-8 border-t">
        <Title text1={"ABOUT"} text2={"US"} />
      </div>

      <div className="my-10 flex flex-col md:flex-row gap-16">
        <img
          src={assets.aboutus2}
          className="w-full md:max-w-[450px]"
          alt=""
        />
        <div className="flex flex-col justify-center gap-6 md:w-2/4 text-gray-600">
          <p>
          Welcome to ARTNART, where creativity meets craftsmanship. We are passionate about curating and delivering the finest collection of artistic pieces that celebrate the beauty and diversity of art.

          </p>
          <p>
          At the heart of our journey lies a deep appreciation for the traditional and contemporary art forms that inspire connection, emotion, and individuality. Our platform serves as a bridge between skilled artists and those who admire and cherish their work, offering a space where art finds its rightful home.

          </p>

          <b className="text-gray-800">Our Mission</b>
          <p>
          Our mission is to make art accessible to everyone while supporting talented artists from across the globe. We strive to create a space where creativity flourishes, enabling artists to share their stories and craft with the world.
          </p>
        </div>
      </div>

      <div className="text-xl py-4">
        <Title text1={"WHY"} text2={"CHOOSE US"} />
      </div>

      <div className="flex flex-col md:flex-row text-sm mb-20">
        <div className="border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5">
          <b>Quality Assurance:</b>
          <p className="text-gray-600">
            We meticulously select and vet each product to ensure it meets our
            stringent quality standard.
          </p>
        </div>
        <div className="border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5">
          <b>Convenience:</b>
          <p className="text-gray-600">
            With our user-friendly interface and hassle-free ordering process,
            shopping fas never been easier.
          </p>
        </div>
        <div className="border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5">
          <b>Exceptional Customer Service:</b>
          <p className="text-gray-600">
            Our team of dedicated professionals is here to assist you the way,
            ensuring your satisfaction is our top priority
          </p>
        </div>
      </div>

      <NewsletterBox />
    </div>
  );
};

export default About;