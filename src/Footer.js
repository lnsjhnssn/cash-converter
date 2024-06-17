function Footer() {
  return (
    <footer>
      <div className="footer-text">
        <p>
          Source:{" "}
          <a href="https://www.frankfurter.app" target="_blank">
            <strong>Frankfurter API</strong>
          </a>
        </p>
        <br />
        <p>Made by Linus Johansson 2024</p>
      </div>
      <ul>
        <li>
          <a href="https://github.com/lnsjhnssn/" target="_blank">
            GitHub
          </a>
        </li>
        <li>
          <a
            href="https://www.linkedin.com/in/linus-johansson-riihimaki/"
            target="_blank"
          >
            LinkedIn
          </a>
        </li>
        <li>
          <a href="mailto:linus.johansson.riihimaki@gmail.com">E-mail</a>
        </li>
      </ul>
      <br />
    </footer>
  );
}

export default Footer;
