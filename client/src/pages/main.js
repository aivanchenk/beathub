import React from "react";
import Navbar from "../components/high_level/navbar";
import Footer from "../components/high_level/footer";
import GradientBar from "../components/low_level/gradient_bar";
import Button from "../components/low_level/button";
import NowPlaying from "../components/low_level/now_playing";
import AuthorCard from "../components/low_level/author_card";

import Person from "../assests/main_page/person.png";
import Splash from "../assests/main_page/watermark.png";
import Arrow from "../assests/icons/arrow-up-right.svg";

import Image1 from "../assests/main_page/pink_floydwebp.png";
import Image2 from "../assests/main_page/maneskin.png";
import Image3 from "../assests/main_page/ed.png";

import Audio3 from "../songs/Ed Sheeran – Shape of You.mp3";
import Audio2 from "../songs/Måneskin – I WANNA BE YOUR SLAVE.mp3";
import Audio1 from "../songs/PHARAOH – Pink Phloyd.mp3";

import "./main.scss";

function Main() {
  console.log(localStorage.getItem("token"));

  return (
    <>
      <Navbar />
      <div className="page-content">
        <section className="hero-section">
          <div className="hero-content">
            <GradientBar />
            <h1 className="headline">Live Your Day with Music</h1>
            <p className="subtext">
              Make your day more lively with a variety of music that suits your
              mood, and try premium to get a variety of better features.
            </p>
            <div className="cta-buttons">
              <Button type="primary">Try it out now</Button>
            </div>
          </div>

          <div className="hero-image">
            <div className="listener-image">
              <img src={Person} alt="Listener" />
              <img src={Splash} alt="Splash" />
            </div>
            <NowPlaying />
          </div>
        </section>

        <section className="popular-section" id="discover">
          <div className="popular-content">
            <h2 className="headline">Popular from All Over the World</h2>
            <p className="subtext">
              Find the most heard and trending songs, enjoy them with millions
              of other users from all over the world, don’t miss them.
            </p>
          </div>
          <div className="explore-button-container">
            <img className="arrow-box" src={Arrow} />
            <img className="arrow-box" src={Arrow} />
          </div>
        </section>

        <section className="authors-section">
          <AuthorCard image={Image1} name="Pink Floyd" audioSrc={Audio1} />
          <AuthorCard image={Image2} name="Maneskin" audioSrc={Audio2} />
          <AuthorCard image={Image3} name="Ed Sheeran" audioSrc={Audio3} />
        </section>
      </div>
      <Footer />
    </>
  );
}

export default Main;
