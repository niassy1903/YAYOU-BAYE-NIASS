import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import axios from 'axios';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://yayou-baye-niass.onrender.com/api/contact/submit', formData);
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => {
        setSubmitted(false);
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de l\'envoi du message.');
      console.error('Erreur lors de l\'envoi du message:', err);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Contactez-nous
          </h2>
          <p className="mt-4 text-lg text-gray-500">
            Une question sur un produit ? Besoin d'aide pour votre commande ? N'hésitez pas à nous écrire.
          </p>
        </div>

        <div className="mt-16 bg-white overflow-hidden shadow rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Contact Info */}
            <div className="p-6 md:p-10 bg-indigo-700 text-white flex flex-col justify-between">
              <div>
                <h3 className="text-2xl font-bold mb-6">Nos Coordonnées</h3>
                <p className="mb-8 text-indigo-100">
                  Complexe Yayou Baye Niass est à votre disposition 7j/7 pour satisfaire toutes vos envies de mode.
                </p>

                <div className="space-y-6">
                  <div className="flex items-start">
                    <Phone className="h-6 w-6 mr-4 text-indigo-300" />
                    <div>
                      <p className="font-medium">Téléphone</p>
                      <p className="mt-1 text-indigo-100">+221 77 123 45 67</p>
                      <p className="text-indigo-100">+221 33 800 00 00</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Mail className="h-6 w-6 mr-4 text-indigo-300" />
                    <div>
                      <p className="font-medium">Email</p>
                      <p className="mt-1 text-indigo-100">contact@yayoubayeniass.com</p>
                      <p className="text-indigo-100">support@yayoubayeniass.com</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <MapPin className="h-6 w-6 mr-4 text-indigo-300" />
                    <div>
                      <p className="font-medium">Adresse</p>
                      <p className="mt-1 text-indigo-100">
                        Marché HLM, Boutique N°102<br />
                        Dakar, Sénégal
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              
            </div>

            {/* Contact Form */}
            <div className="p-6 md:p-10">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Envoyez-nous un message</h3>
              {submitted ? (
                  <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-md flex items-center">
                      <div className="mr-3">✓</div>
                      <div>Message envoyé avec succès ! Nous vous répondrons bientôt.</div>
                  </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nom complet</label>
                    <input
                        type="text"
                        name="name"
                        id="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3 border"
                    />
                    </div>

                    <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                        type="email"
                        name="email"
                        id="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3 border"
                    />
                    </div>

                    <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700">Sujet</label>
                    <input
                        type="text"
                        name="subject"
                        id="subject"
                        required
                        value={formData.subject}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3 border"
                    />
                    </div>

                    <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
                    <textarea
                        name="message"
                        id="message"
                        rows={4}
                        required
                        value={formData.message}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3 border"
                    />
                    </div>
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <div>
                    <button
                        type="submit"
                        className="w-full inline-flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        <Send className="h-5 w-5 mr-2" />
                        Envoyer
                    </button>
                    </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
