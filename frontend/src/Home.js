import React, { useState } from 'react';
import './App.css';
import { ThemeContext } from './themeContext';


function Home() {
  const [theme, setTheme] = useState('light');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.message) newErrors.message = 'Message is required';
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length === 0) {
      // Form is valid, submit the form
      console.log('Form submitted', formData);
    } else {
      setErrors(validationErrors);
    }
  };

  return (
        <><ThemeContext.Provider value={{ theme, setTheme }}>
          <div className="App">
            <header className="header">
              <h1>My Portfolio</h1>
            </header>
            <nav className="navbar">
              <ul>
                <li><a href="#home">Home</a></li>
                <li><a href="#gallery">Gallery</a></li>
                <li><a href="#contact">Contact</a></li>
              </ul> 
            </nav>
          </div>
      </ThemeContext.Provider><div className="App">
              
              

              <section class="gallery" id="gallery">
                  <h2>Image Gallery</h2>
                  <div class="gallery-grid">
                      <img src="https://media.istockphoto.com/id/502426696/photo/beautiful-seascape.jpg?s=612x612&w=0&k=20&c=r0JGQkPUlAmKH2fxU0aZ05UcFUbKAplBrbkPuwhJYlQ=" alt="Image 1" />
                      <img src="https://static.vecteezy.com/system/resources/thumbnails/028/890/052/small_2x/generative-ai-zen-garden-hypnotic-simple-illustration-calm-relax-and-meditation-concept-photo.jpg" alt="Image 2" />
                      <img src="https://t4.ftcdn.net/jpg/01/02/63/45/360_F_102634503_dZGwwFMjHt6nRLxqgbvizWHfZoNd2SuV.jpg" alt="Image 3" />
                  </div>
              </section>

              <section className="contact-form" id="contact">
                  <h2>Contact Me</h2>
                  <form id="form" onSubmit={handleSubmit}>
                      <input
                          type="text"
                          id="name"
                          placeholder="Your Name"
                          value={formData.name}
                          onChange={handleChange}
                          required />
                      {errors.name && <span className="error">{errors.name}</span>}
                      <input
                          type="email"
                          id="email"
                          placeholder="Your Email"
                          value={formData.email}
                          onChange={handleChange}
                          required />
                      {errors.email && <span className="error">{errors.email}</span>}
                      <textarea
                          id="message"
                          placeholder="Your Message"
                          value={formData.message}
                          onChange={handleChange}
                          required
                      ></textarea>
                      {errors.message && <span className="error">{errors.message}</span>}
                      <button type="submit">Send</button>
                  </form>
              </section>
          </div></>

    
  );
}

export default Home;

