import fs from "fs"
import iconv from 'iconv-lite'
import path from "path"
import express from "express"
import cookie from 'cookie-parser';
import parseurl from 'parseurl';
import qs from 'qs';
import googleapis from 'googleapis';
import unescape from 'unescape';
import Encoding from 'encoding-japanese';

import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { match } from "assert";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const port = 80;
var gs_api = "AIzaSyAQ1COaA2F1l6HC1iHLBhBQKsarwqzFvC8";
var gs_engineID = "c408fe1ea74914f5b";
var toHTTP = true;
var FUCK = false;
var redirector = true;
var redirector_only = "yt2009";
var waybackdate = "20100324182056";
var yt2009address = "192.168.40.134:8080";
var only_old = true;
var only_old_date = "2010-03-20";
var serverlanguage = "en";

const {google} = googleapis;
const customSearch = google.customsearch("v1");

const app = express();


const template_gbar_user = path.join(__dirname, "/template/" + serverlanguage + "/gbar_user.txt"); // ext_t_g_u
const template_gbar_user_index = path.join(__dirname, "/template/" + serverlanguage + "/gbar_user_index.txt"); // ext_t_g_u
const template_gbar_user_logged = path.join(__dirname, "/template/" + serverlanguage + "/gbar_user_logged.txt"); // ext_t_g_u_l

const template_search_normal = path.join(__dirname, "/template/" + serverlanguage + "/search/normal.txt"); // ext_t_s_n
const template_search_more = path.join(__dirname, "/template/" + serverlanguage + "/search/more.txt"); // ext_t_s_m
const template_search_EOM = path.join(__dirname, "/template/" + serverlanguage + "/search/more_eom.txt"); // ext_t_s_EOM

const ext_t_g_u = fs.readFileSync(template_gbar_user, "utf8")
const ext_t_g_u_i = fs.readFileSync(template_gbar_user_index, "utf8")
const ext_t_g_u_l = fs.readFileSync(template_gbar_user_logged, "utf8")

var query;
var actualq;

let SimLogin = [];

// https://qiita.com/ganyariya/items/23d51b05bacdcb27fce6
// im using the google search example from here v (thx for og author)

async function search(event) {

    let result = await customSearch.cse.list({

        auth: gs_api,

        cx: gs_engineID,

        q: query
    });

    console.log(result);
    return(result);
}

app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

app.use(cookie());

app.use(express.static('public'));

app.listen(port, () => {
    console.log(`port: ${port}`);
});

app.get('/intl/ja_jp/images/logo.gif', (req, res) => {
    fs.readFile('./assets/images/ja_jp/logo.gif', (err, data) => {
      res.type('gif');
      res.send(data);
    });
})

app.get('/intl/en_ALL/images/logo.gif', (req, res) => {
    fs.readFile('./assets/images/en-ALL/logo.gif', (err, data) => {
      res.type('gif');
      res.send(data);
    });
})

app.get('/images/nav_logo3.png', (req, res) => {
    fs.readFile('./assets/images/nav_logo3.png', (err, data) => {
      res.type('png');
      res.send(data);
    });
})

app.get('/accounts/mail.gif', (req, res) => {
    fs.readFile('./assets/images/accounts/mail.gif', (err, data) => {
      res.type('gif');
      res.send(data);
    });
})

app.get('/accounts/msh.gif', (req, res) => {
    fs.readFile('./assets/images/accounts/msh.gif', (err, data) => {
      res.type('gif');
      res.send(data);
    });
})

app.get('/intl/ja_ALL/images/logos/images_logo_lg.gif', (req, res) => {
    fs.readFile('./assets/images/ja-ALL/images_logo_lg.gif', (err, data) => {
      res.type('gif');
      res.send(data);
    });
})

app.get('/accounts/ig.gif', (req, res) => {
    fs.readFile('./assets/images/accounts/ig.gif', (err, data) => {
      res.type('gif');
      res.send(data);
    });
})

app.get('/accounts/sierra.gif', (req, res) => {
    fs.readFile('./assets/images/accounts/sierra.gif', (err, data) => {
      res.type('gif');
      res.send(data);
    });
})

app.get('/accounts/google_transparent.gif', (req, res) => {
    fs.readFile('./assets/images/accounts/google_transparent.gif', (err, data) => {
      res.type('gif');
      res.send(data);
    });
})

app.get('/intl/ja/images/logos/accounts_logo.gif', (req, res) => {
    fs.readFile('./assets/images/ja/accounts_logo.gif', (err, data) => {
      res.type('gif');
      res.send(data);
    });
})

app.get('/intl/en/images/logos/accounts_logo.gif', (req, res) => {
    fs.readFile('./assets/images/en/accounts_logo.gif', (err, data) => {
      res.type('gif');
      res.send(data);
    });
})

app.get('/favicon.ico', (req, res) => {
    fs.readFile('./assets/favicon.ico', (err, data) => {
      res.type('ico');
      res.send(data);
    });
})

app.get('/webhp', (req, res) => {
    console.log(req.cookies.SimLogin);
    let SimLogin = req.cookies.SimLogin;
    const filePath = path.join(__dirname, "/html/" + serverlanguage + "/index.html");
    fs.readFile(filePath, (err, data) => {
        let repl = "";
        
        if (serverlanguage == "ja") {
            repl = iconv.decode(data, 'shift_jis')
        } else {
            repl = data.toString();
        }

        if (SimLogin == undefined || SimLogin == "" || SimLogin == "undefined") {
            repl = repl.replace("gbar_user_REPLACE_HERE", ext_t_g_u_i)
        } else {
            repl = repl.replace("gbar_user_REPLACE_HERE", ext_t_g_u_l)
        }
        
        repl = repl.replace(/gbar_username/g, SimLogin)
        if (serverlanguage == "ja"){
            let encoded = iconv.encode(repl, 'shift_jis')
            res.set("Content-Type", "text/html;charset=Shift_JIS")
            res.send(encoded)
            return
        }
        res.send(repl)
        
    } )
    return
});

app.get('/imghp', (req, res) => {
    console.log(req.cookies.SimLogin);
    if (req.cookies.SimLogin === undefined) {
        const filePath = path.join(__dirname, "/html/" + serverlanguage + "/images/index.html");
            fs.readFile(filePath, (err, data) => {
            res.set("Content-Type", "text/html;charset=Shift_JIS")
            res.send(data)
        } )
        return
    }
    if (req.cookies.SimLogin == 'undefined') {
        const filePath = path.join(__dirname, "/html/" + serverlanguage + "/images/index.html");
            fs.readFile(filePath, (err, data) => {
            res.set("Content-Type", "text/html;charset=Shift_JIS")
            res.send(data)
        } )
        return
    }
    let SimLogin = req.cookies.SimLogin;
    const filePath = path.join(__dirname, "/html/" + serverlanguage + "/images/index_signed_in.html");
    fs.readFile(filePath, (err, data) => {
        let decoded = iconv.decode(data, 'shift_jis')
        let replaced = decoded.replace(/username/g, SimLogin)
        let encoded = iconv.encode(replaced, 'shift_jis')
        res.set("Content-Type", "text/html;charset=Shift_JIS")
        res.send(encoded)
    } )
    return
});

app.get('/', (req, res) => {
    console.log(req.cookies.SimLogin);
    let SimLogin = req.cookies.SimLogin;
    const filePath = path.join(__dirname, "/html/" + serverlanguage + "/index.html");
    fs.readFile(filePath, (err, data) => {
        let repl = "";
        
        if (serverlanguage == "ja") {
            repl = iconv.decode(data, 'shift_jis')
        } else {
            repl = data.toString();
        }

        if (SimLogin == undefined || SimLogin == "" || SimLogin == "undefined") {
            repl = repl.replace("gbar_user_REPLACE_HERE", ext_t_g_u_i)
        } else {
            repl = repl.replace("gbar_user_REPLACE_HERE", ext_t_g_u_l)
        }
        
        repl = repl.replace(/gbar_username/g, SimLogin)
        if (serverlanguage == "ja"){
            let encoded = iconv.encode(repl, 'shift_jis')
            res.set("Content-Type", "text/html;charset=Shift_JIS")
            res.send(encoded)
            return
        }
        res.send(repl)
        
    } )
    return
});


app.get('/accounts/Login', (req, res) => {
    const filePath = path.join(__dirname, "/html/" + serverlanguage + "/signin.html");
    fs.readFile(filePath, (err, data) => {
        res.set("Content-Type", "text/html;charset=Shift_JIS")
        res.send(data)
    } )
})

app.post('/accounts/LoginAuth', (req, res) => {
    console.log(req.body);
    var SimLogin = req.body.Email;
    /*
    if (SimLogin = "undefined") {
        res.writeHead(302, {
	        'Location': '/'
            });
        res.end();
    }
    */
    res.cookie('SimLogin', SimLogin, { maxAge: 2592000000 });
    res.redirect('/');
})

app.get('/clearcookies', (req, res) => {
    res.clearCookie('SimLogin');
    res.redirect('/');
})

app.get('/search', async (req, res) => {
    const startTime = Date.now();
    let nowTime = 0;
    var sqparam = qs.parse(parseurl(req).query);
    console.log(sqparam.q);
    if (sqparam.q == "") {
        res.redirect('/');
        return
    }
    if (sqparam.q.includes('%')) {
        let sjisArray = Encoding.urlDecode(sqparam.q);
        let unicodeArray = Encoding.convert(sjisArray, { to: 'UNICODE', from: 'SJIS' });
        query = Encoding.codeToString(unicodeArray);
    } else {
        query = sqparam.q;
    }
    console.log(query)

    if (only_old == true) {
        actualq = query
        if (only_old_date == undefined) {
            query = query + " before:2010-03-21";
        }
        query = query + " before:" + only_old_date;
    }

    console.log(req.query)

    let result = await search();
    console.log("result: ", result);
    console.log(JSON.stringify(result.data.items, null, 2))
    console.log("-----------------------------------------------");
    const link = [];
    result.data.items.forEach(item => {
        console.log("-----------------------------")
        console.log(item.htmlTitle, item.displayLink, item.link, item.htmlSnippet, item.htmlFormattedUrl)
        link.push(item.displayLink);
    })

    if (req.query.btnI == "I'm Feeling Lucky") {
        res.redirect(result.data.items[0].link)
        return
    }

    const linklist = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    const alphlist = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"];
    link.forEach((item, i) => {
        
        console.log("link:" + link[i])
        let alp = alphlist[i];
        console.log("link alp:" + alp)
        result.data.items.forEach((item, o) => {
            console.log("checking url:", item.displayLink)
            if (linklist[i] == 0){
                console.log("no")
                return
            }
            if (o == i) {
                console.log("no")
                return
            }
            if (typeof linklist[i] !== 'number') {
                console.log("no")
                return
            }
            if (link[i] == item.displayLink){
                if (i <= o) {
                    console.log("matched???? nah")
                    return
                }
                if (isNaN(linklist[i])){
                    console.log("nah")
                    return
                }
                console.log("matched!")
                linklist[i] = o + alp
                return
            }
            console.log("checked:" + o)
        })
        console.log("checked url:" + i)
    })

    const linkalplist = [...linklist].sort();
    const linknumlist = [...linklist].sort();

    linknumlist.forEach((item, i) => {
        if (typeof linknumlist[i] !== 'number') {
            linknumlist[i] = alphlist.indexOf(linknumlist[i].slice(1));
        }
    })

    console.log("linkalplist:")
    console.log(linkalplist);
    console.log("linknumlist:")
    console.log(linknumlist);
    
    if (FUCK == true) {
        result.data.items.forEach(item => {
            item.htmlTitle = item.htmlTitle.replace("Download <b>Windows</b>", "Download THE FUCKING HORRIBLE WINDOWS 11")
            item.htmlTitle = item.htmlTitle.replace("<b>Windows</b> 11", "FUCK WINDOWS 11")
            item.htmlTitle = item.htmlTitle.replace("<b>Windows 11</b>", "FUCK WINDOWS 11")
            item.htmlTitle = item.htmlTitle.replace("AI", "THE FUCKING AI")
            item.htmlTitle = item.htmlTitle.replace("Copilot", "THE FUCKING HORRIBLE AI")
        })
    }

    let filePath = "";
    filePath = path.join(__dirname, "/html/" + serverlanguage + "/search.html");
    
    fs.readFile(filePath, (err, data) => {
        const ext_t_s_n = fs.readFileSync(template_search_normal, "utf8")
        const ext_t_s_m = fs.readFileSync(template_search_more, "utf8")
        const ext_t_s_eom = fs.readFileSync(template_search_EOM, "utf8")

        let repl = "";
        
        if (serverlanguage == "ja") {
            repl = iconv.decode(data, 'shift_jis')
        } else {
            repl = data.toString();
        }

        let SimLogin = req.cookies.SimLogin;

        if (SimLogin == undefined || SimLogin == "" || SimLogin == "undefined") {
            repl = repl.replace("gbar_user_REPLACE_HERE", ext_t_g_u)
        } else {
            repl = repl.replace("gbar_user_REPLACE_HERE", ext_t_g_u_l)
        }

        
        
        if (only_old == true) {
            repl = repl.replace(/query/g, actualq)
        } else {
            repl = repl.replace(/query/g, query)
        }
        
        let lastIdx = linkalplist.findLastIndex(item => /[a-z]/i.test(item))
        
        let items = repl.split("item")

        let count = linkalplist.filter(v => /[a-z]/i.test(String(v))).length
        if (count == 0) {
            void(0);
        } else {
            items.splice(lastIdx + 1, 0, "\nlastone\n")
        }

        repl = items.join("item")

        result.data.items.forEach((item, i) => {
            if (typeof linkalplist[i] !== 'number') {
                repl = repl.replace(/item/, ext_t_s_m)
                return
            }
            repl = repl.replace(/item/, ext_t_s_n)
            repl = repl.replace(/lastone/, ext_t_s_eom)
        })
        
        repl = repl.replace(/htmlTitle/, result.data.items[0].htmlTitle)
        if (toHTTP == true) {
            result.data.items[0].link = result.data.items[0].link.replace("https://", "http://")
        }
        repl = repl.replace(/UrlLink/, result.data.items[0].link)
        repl = repl.replace(/htmlSnippet/, result.data.items[0].htmlSnippet)
        repl = repl.replace(/relatedUrlLink/, result.data.items[0].link)
        repl = repl.replace(/htmlFormattedUrl/, result.data.items[0].htmlFormattedUrl)
        repl = repl.replace(/displayLink/, result.data.items[0].displayLink)

        result.data.items.forEach((item, i) => {
            repl = repl.replace(/htmlTitle/, item.htmlTitle)
            if (toHTTP == true) {
                item.link = item.link.replace("https://", "http://")
            }
            if (redirector == true) {
                let waybacklink
                if (redirector_only == "yt2009") {
                    if (yt2009address == undefined) {
                        return
                    }
                    item.link = item.link.replace("youtube.com", yt2009address)
                    item.link = item.link.replace("www.youtube.com", yt2009address)
                } else if (redirector_only == "wayback") {
                    if (waybackdate == undefined) {
                        waybacklink = "http://web.archive.org/web/20100324182056/"
                    } else {
                        waybacklink = "http://web.archive.org/web/" + waybackdate + "/"
                    }
                    item.link = item.link.replace("http://", waybacklink)
                    item.link = item.link.replace("https://", waybacklink)
                } else {
                    if (waybackdate == undefined) {
                        waybacklink = "http://web.archive.org/web/20100324182056/"
                    } else {
                        waybacklink = "http://web.archive.org/web/" + waybackdate + "/"
                    }
                    item.link = item.link.replace("http://", waybacklink)
                    item.link = item.link.replace("https://", waybacklink)

                    if (yt2009address == undefined) {
                    } else {
                        let yt2009link = "http://" + yt2009address;
                        let ytlink0 = waybacklink + "https://www.youtube.com"
                        let ytlink1 = waybacklink + "http://www.youtube.com"
                        let ytlink2 = waybacklink + "www.youtube.com"
                        item.link = item.link.replace(ytlink0, yt2009link)
                        item.link = item.link.replace(ytlink1, yt2009link)
                        item.link = item.link.replace(ytlink2, yt2009link)
                    }
                }
            }
            repl = repl.replace(/UrlLink/, item.link)
            repl = repl.replace(/htmlSnippet/, item.htmlSnippet)
            repl = repl.replace(/relatedUrlLink/, item.link)
            repl = repl.replace(/htmlFormattedUrl/, item.htmlFormattedUrl)
            repl = repl.replace(/displayLink/, item.displayLink)
        })

        repl = repl.replace(/item/g, "")

        nowTime = (Date.now() - startTime) / 1000;
        const searchFinish = nowTime.toString();

        repl = repl.replace(/searchFinish/g, searchFinish.slice(0,4))

        repl = repl.replace(/gbar_username/g, SimLogin)
        if (serverlanguage == "ja"){
            let encoded = iconv.encode(repl, 'shift_jis')
            res.set("Content-Type", "text/html;charset=Shift_JIS")
            res.send(encoded)
            return
        }
        res.send(repl)
    } )
})