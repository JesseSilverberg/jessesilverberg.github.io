var now = new Date();
if (now.getMonth() === 11) {

  function toggleSnow(e) {
    if (e.checked) {
      document.getElementsByClassName('snow')[0].style.display = "none";
    } else {
      document.getElementsByClassName('snow')[0].style.display = "";
    }
  }

  var snow = document.createElement('div');
  snow.classList.add("snow");
  document.body.insertBefore(snow, document.body.childNodes[0]);

  for (var i = 0; i < 50; i++) {
    var snowflake = document.createElement('div');
    snowflake.classList.add('snowflake');
    snow.appendChild(snowflake);
  }

  // var toggle = document.createElement('div');
  // toggle.classList.add('snow-toggle');
  // toggle.innerHTML = `
  // <input type="checkbox" id="toggle1" class="toggle" onchange="toggleSnow(this)">
  //   <div class="emoji"></div>
  //   <label for="toggle1" class="well"></label>
  // `;


  // document.getElementById('toggles').insertBefore(toggle,document.getElementById('toggles').childNodes[0]);
  // document.getElementById('toggles').classList.add('float-right', 'mx-8', 'my-6', 'flex', 'gap-8');

  var styleEl = document.createElement('style');
  styleEl.innerText = `

  .snow{
      position:fixed;
      top:0;
      left:0;
      right:0;
      bottom:0;
      z-index: 21;
      pointer-events:none;
  }
  .snowflake {
    --size: 1vw;
    width: var(--size);
    height: var(--size);
    background: #d8d8d8;
    border-radius: 50%;
    position: absolute;
    top: -5vh;
  }

  @keyframes snowfall {
    0% {
      transform: translate3d(var(--left-ini), 0, 0);
    }
    100% {
      transform: translate3d(var(--left-end), 110vh, 0);
    }
  }

  .snowflake:nth-child(3n) {
    filter: blur(1px);
  }

  @charset "UTF-8";
  .snow-toggle {
    position: relative;
    width: 4rem;
  }


  .snow-toggle .well {
    display: block;
    background: #eee;
    height: 1.5rem;
    border-radius: .75rem;
    cursor: pointer;
    transition: 0.2s;
  }
  .snow-toggle .toggle:checked ~ .well {
    background: #ddd;
  }
  .snow-toggle .emoji {
    line-height: normal;
  }
  .snow-toggle .toggle {
    opacity: 0;
    border: 0;
    outline: none;
    height: 100%;
    width: 100%;
    background: transparent;
    position: absolute;
    cursor: pointer;
    z-index: 100;
  }
  .snow-toggle .toggle ~ .emoji:before {
    position: absolute;
    left: 0;
    top: -1.27rem;
    font-size: 3.2rem;
    transition: 0.2s;
    margin-left: -.3em;
  }
  .snow-toggle .toggle:checked ~ .emoji:before {
    left: 100%;
    margin-left: -.7em;
  }
  .snow-toggle .toggle ~ label {
    white-space: nowrap;
  }
  .snow-toggle .toggle ~ label:before {
    position: absolute;
    right: 100%;
    top: 0;
  }
  .snow-toggle .toggle ~ label:after {
    position: absolute;
    left: 100%;
    top: 0;
  }

  .snow-toggle .toggle ~ .emoji:before {
    content: "❄️";
  }
  .snow-toggle .toggle:checked ~ .emoji:before {
    content: "❄️";
  }
  `;

  document.head.appendChild(styleEl);
  var styleSheet = styleEl.sheet;

  for (var i = 0; i < 50; i++) {
    var style = `
    .snowflake:nth-child(${i}) {
      --size: ${Math.random() * .8+ .4}vh;
      --left-ini: ${Math.random() * 20-10}vw;
      --left-end: ${Math.random() * 20-10}vw;
      left: ${Math.random() * 100}vw;
      animation: snowfall ${Math.random() * 9+6}s linear infinite;
      animation-delay: -${Math.random() * 9+1}s;
    }
    `;
    styleSheet.insertRule(style);
  }
}
