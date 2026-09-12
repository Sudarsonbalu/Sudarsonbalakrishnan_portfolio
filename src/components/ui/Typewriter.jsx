import React, { useState, useEffect } from 'react';

const Typewriter = ({ 
  words = [], 
  typingSpeed = 80, 
  deletingSpeed = 40, 
  delayBetweenWords = 2000, 
  className = "" 
}) => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (words.length === 0) return;

    let timer;
    const activeWord = words[currentWordIndex];

    if (!isDeleting) {
      // Typing phase
      if (currentText.length < activeWord.length) {
        timer = setTimeout(() => {
          setCurrentText(activeWord.substring(0, currentText.length + 1));
        }, typingSpeed);
      } else {
        // Fully typed: wait before deleting
        timer = setTimeout(() => {
          setIsDeleting(true);
        }, delayBetweenWords);
      }
    } else {
      // Deleting phase
      if (currentText.length > 0) {
        timer = setTimeout(() => {
          setCurrentText(activeWord.substring(0, currentText.length - 1));
        }, deletingSpeed);
      } else {
        // Fully deleted: switch to next word
        setIsDeleting(false);
        setCurrentWordIndex((prevIndex) => (prevIndex + 1) % words.length);
      }
    }

    return () => clearTimeout(timer);
  }, [currentText, isDeleting, currentWordIndex, words, typingSpeed, deletingSpeed, delayBetweenWords]);

  return (
    <span className={`${className} typing-cursor`}>
      {currentText}
    </span>
  );
};

export default Typewriter;
