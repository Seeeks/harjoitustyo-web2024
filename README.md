Kyseessä on minipeli, joka sisältää yksinkertaisen avatar-editorin. Avatarin ulkonäkö vaikuttaa pelaajahahmon ulkonäköön pelissä. Käyttäjä voi valita hahmolle ihonvärin, paidan värin, taustan, silmät ja suun. Kullekin on 4 vaihtoehtoa. Huom. vain ihonväri ja paidan väri vaikuttavat pelaajahahmoon. (Silmät ja suu ovat tällä hetkellä staattiset ja vaikuttavat vain profiilikuvaan, ei pelihahmoon.)

Huom! Peli käyttää fetchiä, joten kuvien näkyminen vaatii pelin ajamisen local serverin kautta (esim. laragon tai xampp) tai muuten tulee CORS-virhe. Peliä voi pelata myös ilman kuvia, jolloin sen pystyy ajamaan suoraan.

"Access to fetch at 'file:///C:/Users/[...]/harjoitustyo-web2024-main/images/hero.svg' from origin 'null' has been blocked by CORS policy: Cross origin requests are only supported for protocol schemes: chrome, chrome-extension, chrome-untrusted, data, http, https, isolated-app."

Etusivulla sisältö menee pienillä näytöillä kuvan päälle, tableteilla ja sitä isommilla sisältö menee keskilinjan oikealle puolelle. Avatar editoriin ja peliin pääsee joko etusivun nappuloista tai navbarista.

Avatar editorissa kun painaa save-nappulaa, näytölle spawnaa tähtiä, jotka poistuvat viiveellä. Avatarin tiedot tallennetaan local storageen. Reset-nappulan painaminen poistaa tiedot local storagesta.

Pelissä on tarkoituksena kerätä omenia ja väistellä kaktuksia. Osa kaktuksista liikkuu (lineaarisesti). Hahmo liikkuu edellisen klikkauksen suuntaan, kunnes saavuttaa sen, jonka jälkeen hän pysähtyy. Suuntaa voi vaihtaa lennossa klikkaamalla eri paikkaa. Pelialueen koko sopeutuu näytön kokoon. Jos osuu kaktukseen, häviää pelin, jonka jälkeen ei voi pelata ennen kuin painaa New Game -nappulaa. Nappulan painaminen myös nollaa pistelaskurin.

Sivuston toteutuksessa on käytetty apuna ChatGPT:tä (Sider Fusion).

Css-tähtien muodon lähde on https://www.coding-dude.com/wp/css/css-star/

Nappuloiden muotoiluun käytetty scss-koodi on alun perin saatu käyttäjältä Vael Victus. Olen jälkikäteen tehnyt siihen omia muokkauksia. Muilta osin suurin osa custom.scss asetuksista on kierrätetty aiemmasta projektistani https://otherworld.fi