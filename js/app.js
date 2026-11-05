(function () {
  var OZ = 31.1034768,
    GOLD_G = 87.48,
    SILVER_G = 612.36;
  var M = {
    goldOz: 4120.1,
    silverOz: 60.991,
    CAD: 1.4166,
    GBP: 0.75396,
    EUR: 0.92,
    updated: "",
    error: false,
    loading: true,
  };
  var gpg, spg;
  function setPrices() {
    gpg = (M.goldOz * M.CAD) / OZ;
    spg = (M.silverOz * M.CAD) / OZ;
  }
  setPrices();
  var $ = function (s, r) {
      return (r || document).querySelector(s);
    },
    $$ = function (s, r) {
      return Array.prototype.slice.call((r || document).querySelectorAll(s));
    };
  var fmt = function (n) {
    return new Intl.NumberFormat("en-CA", {
      style: "currency",
      currency: "CAD",
      maximumFractionDigits: 2,
    }).format(n);
  };
  var INVT = [
    ["stocks", "Stocks & shares", "Shares you can access or sell."],
    [
      "funds",
      "Funds & ETFs",
      "Accessible mutual funds and exchange-traded funds.",
    ],
    [
      "crypto",
      "Cryptocurrency",
      "Digital assets held in wallets or exchanges.",
    ],
    [
      "pension",
      "Accessible pension",
      "The portion of a pension you can access now.",
    ],
    [
      "other",
      "Other investment",
      "Another accessible investment not listed here.",
    ],
  ];
  var CASHC = [
    "Chequing",
    "Savings",
    "Cash at home",
    "Digital wallet",
    "TFSA",
    "RRSP",
    "Other",
  ];
  var LIABT = [
    ["rent", "Rent or housing payment"],
    ["housing", "Home payment currently due"],
    ["utilities", "Utilities and bills"],
    ["invoices", "Business invoices"],
    ["salaries", "Staff salaries"],
    ["other", "Other"],
  ];
  var S;
  function fresh() {
    return {
      cash: [{ cat: "Chequing", label: "Chequing", amount: 0 }],
      business: [{ label: "Inventory", amount: 0 }],
      owed: [{ label: "Money expected during the lunar year", amount: 0 }],
      inv: [{ type: "stocks", amount: 0, currency: "CAD" }],
      fx: [{ cur: "USD", code: "", amount: 0, rate: 0 }],
      gold: [{ karat: 24, grams: 0 }],
      silver: [{ grams: 0 }],
      liab: [{ type: "rent", label: "", amount: 0 }],
      interest: 0,
    };
  }
  S = fresh();
  var TRASH =
    '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ><path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14"/></svg>';
  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }
  function money(list, i, f, sym) {
    return (
      '<label class="money"><span class="sr">Amount</span><b>' +
      sym +
      '</b><input class="fi" type="number" min="0" step=".01" placeholder="0.00" value="' +
      (S[list][i][f] || "") +
      '" data-l="' +
      list +
      '" data-i="' +
      i +
      '" data-f="' +
      f +
      '"></label>'
    );
  }
  function del(list, i) {
    return (
      '<button class="del" type="button" aria-label="Remove line" data-del="' +
      list +
      '" data-i="' +
      i +
      '"' +
      (S[list].length === 1 ? " disabled" : "") +
      ">" +
      TRASH +
      "</button>"
    );
  }
  function txt(list, i, f, ph) {
    return (
      '<input class="fi" value="' +
      esc(S[list][i][f]) +
      '" placeholder="' +
      ph +
      '" data-l="' +
      list +
      '" data-i="' +
      i +
      '" data-f="' +
      f +
      '" data-t="1">'
    );
  }
  function sel(list, i, f, opts, cls) {
    return (
      '<select class="fs ' +
      (cls || "") +
      '" data-l="' +
      list +
      '" data-i="' +
      i +
      '" data-f="' +
      f +
      '" data-t="1" data-sel="1">' +
      opts
        .map(function (o) {
          var v = o[0],
            l = o[1];
          return (
            '<option value="' +
            v +
            '"' +
            (String(S[list][i][f]) === String(v) ? " selected" : "") +
            ">" +
            l +
            "</option>"
          );
        })
        .join("") +
      "</select>"
    );
  }
  var R = {
    cash: function (i) {
      var r = S.cash[i];
      return (
        '<div class="row"><div class="rg"><div>' +
        sel(
          "cash",
          i,
          "cat",
          CASHC.map(function (c) {
            return [c, c];
          }),
        ) +
        (r.cat === "Other"
          ? '<input class="fi sm" style="margin-top:8px" value="' +
            esc(r.label) +
            '" placeholder="Describe this account" data-l="cash" data-i="' +
            i +
            '" data-f="label" data-t="1">'
          : "") +
        "</div>" +
        money("cash", i, "amount", "$") +
        del("cash", i) +
        '</div><p class="help">Add a line so you can remember what this amount represents.</p></div>'
      );
    },
    business: function (i) {
      return (
        '<div class="row"><div class="rg">' +
        txt("business", i, "label", "Inventory or location") +
        money("business", i, "amount", "$") +
        del("business", i) +
        '</div><p class="help">Add a line so you can remember what this amount represents.</p></div>'
      );
    },
    owed: function (i) {
      return (
        '<div class="row"><div class="rg">' +
        txt("owed", i, "label", "Who or what is paying you?") +
        money("owed", i, "amount", "$") +
        del("owed", i) +
        '</div><p class="help">Add a line so you can remember what this amount represents.</p></div>'
      );
    },
    inv: function (i) {
      var r = S.inv[i],
        d = INVT.filter(function (t) {
          return t[0] === r.type;
        })[0][2];
      return (
        '<div class="row"><div class="rg inv">' +
        sel(
          "inv",
          i,
          "type",
          INVT.map(function (t) {
            return [t[0], t[1]];
          }),
        ) +
        sel("inv", i, "currency", [
          ["CAD", "CAD"],
          ["USD", "USD"],
        ]) +
        money("inv", i, "amount", "$") +
        del("inv", i) +
        '</div><p class="help">' +
        d +
        ' Converted to <span data-invline="' +
        i +
        '"></span> CAD.</p></div>'
      );
    },
    fx: function (i) {
      var r = S.fx[i],
        sym =
          r.cur === "GBP"
            ? "£"
            : r.cur === "EUR"
              ? "€"
              : r.cur === "other"
                ? r.code || "¤"
                : "$";
      return (
        '<div class="row"><div class="rg fx">' +
        sel("fx", i, "cur", [
          ["USD", "US dollars (USD)"],
          ["GBP", "British pounds (GBP)"],
          ["EUR", "Euros (EUR)"],
          ["other", "Other currency"],
        ]) +
        money("fx", i, "amount", sym) +
        del("fx", i) +
        "</div>" +
        (r.cur === "other"
          ? '<div class="rg fx" style="margin-top:12px;grid-template-columns:1fr 1fr"><input class="fi sm" value="' +
            esc(r.code) +
            '" maxlength="6" placeholder="Currency code, e.g. EUR" data-l="fx" data-i="' +
            i +
            '" data-f="code" data-t="1" data-up="1"><label class="money"><b>$</b><input class="fi sm" type="number" min="0" step=".0001" placeholder="CAD for 1 unit" value="' +
            (r.rate || "") +
            '" data-l="fx" data-i="' +
            i +
            '" data-f="rate"></label></div>' +
            (r.rate <= 0
              ? '<p class="warn">Enter the CAD value of one unit to include this balance in the estimate.</p>'
              : "")
          : "") +
        '<p class="approx" data-fxline="' +
        i +
        '"></p></div>'
      );
    },
    gold: function (i) {
      return (
        '<div class="mrow">' +
        sel(
          "gold",
          i,
          "karat",
          [
            [24, "24k"],
            [22, "22k"],
            [21, "21k"],
            [18, "18k"],
          ],
          "sm",
        ) +
        '<input class="fi sm" type="number" min="0" step=".01" placeholder="grams" value="' +
        (S.gold[i].grams || "") +
        '" data-l="gold" data-i="' +
        i +
        '" data-f="grams">' +
        del("gold", i) +
        "</div>"
      );
    },
    silver: function (i) {
      return (
        '<div class="mrow s"><input class="fi sm" type="number" min="0" step=".01" placeholder="Grams of silver" value="' +
        (S.silver[i].grams || "") +
        '" data-l="silver" data-i="' +
        i +
        '" data-f="grams">' +
        del("silver", i) +
        "</div>"
      );
    },
    liab: function (i) {
      return (
        '<div class="row"><div class="rg due">' +
        sel("liab", i, "type", LIABT) +
        txt(
          "liab",
          i,
          "label",
          S.liab[i].type === "other" ? "Add your own label" : "Optional note",
        ) +
        money("liab", i, "amount", "$") +
        del("liab", i) +
        '</div><p class="help">' +
        (S.liab[i].type === "other"
          ? "Use the label column to remember what this amount is for."
          : "Only include the portion due within the relevant period.") +
        "</p></div>"
      );
    },
  };
  function renderList(k) {
    var el = $('[data-list="' + k + '"]');
    if (!el) return;
    el.innerHTML = S[k]
      .map(function (_, i) {
        return R[k](i);
      })
      .join("");
  }
  function renderAll() {
    ["cash", "business", "owed", "inv", "fx", "gold", "silver", "liab"].forEach(
      renderList,
    );
    $("#interest").value = S.interest || "";
    calc();
  }
  function sum(a, f) {
    return a.reduce(function (s, r) {
      return s + Math.max(0, r[f] || 0);
    }, 0);
  }
  function invCad(r) {
    return Math.max(0, r.amount || 0) * (r.currency === "USD" ? M.CAD : 1);
  }
  function fxCad(r) {
    var rate =
      r.cur === "USD"
        ? M.CAD
        : r.cur === "GBP"
          ? M.CAD / Math.max(M.GBP, 1e-4)
          : r.cur === "EUR"
            ? M.CAD / Math.max(M.EUR, 1e-4)
            : r.rate;
    return Math.max(0, r.amount) * Math.max(0, rate || 0);
  }
  var intent = null;
  function calc() {
    var cash = sum(S.cash, "amount"),
      biz = sum(S.business, "amount"),
      owed = sum(S.owed, "amount"),
      inv = S.inv.reduce(function (t, r) {
        return t + invCad(r);
      }, 0);
    var fx = S.fx.reduce(function (s, r) {
      return s + fxCad(r);
    }, 0);
    var g = S.gold.reduce(function (s, r) {
        return s + r.grams * gpg * (r.karat / 24);
      }, 0),
      sv = S.silver.reduce(function (s, r) {
        return s + r.grams * spg;
      }, 0);
    var due = sum(S.liab, "amount"),
      gross = cash + biz + owed + inv + fx + g + sv,
      used = Math.max(0, gross - due);
    var goldN = GOLD_G * gpg,
      silN = SILVER_G * spg,
      which = used < goldN ? "silver" : "gold",
      nis = which === "gold" ? goldN : silN,
      reached = used >= nis,
      z = reached ? used * 0.025 : 0,
      pct = Math.min(100, nis ? (used / (nis * 2)) * 100 : 0),
      need = Math.max(0, nis - used),
      I = S.interest || 0;
    $$('[data-tot="cash"]').forEach(function (e) {
      e.textContent = fmt(cash);
    });
    $$('[data-tot="business"]').forEach(function (e) {
      e.textContent = fmt(biz);
    });
    $$('[data-tot="owed"]').forEach(function (e) {
      e.textContent = fmt(owed);
    });
    $$('[data-tot="inv"]').forEach(function (e) {
      e.textContent = fmt(inv);
    });
    $("#fxTot").textContent =
      "$" +
      fx.toLocaleString("en-CA", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }) +
      " CAD";
    $$("[data-invline]").forEach(function (e) {
      e.textContent = fmt(invCad(S.inv[+e.getAttribute("data-invline")]));
    });
    $$("[data-fxline]").forEach(function (e) {
      e.textContent =
        "≈ $" +
        fxCad(S.fx[+e.getAttribute("data-fxline")]).toLocaleString("en-CA", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }) +
        " CAD";
    });
    $("#metalTot").textContent = fmt(g + sv);
    $("#goldTot").textContent = fmt(g);
    $("#silverTot").textContent = fmt(sv);
    $("#goldPG").textContent =
      fmt(gpg) + " per gram at the live reference price";
    $("#silverPG").textContent =
      fmt(spg) + " per gram at the live reference price";
    $("#liabTot").textContent = fmt(due);
    $("#nsV").textContent = fmt(silN);
    $("#ngV").textContent = fmt(goldN);
    $("#nbS").className = "nb" + (which === "silver" ? " on" : "");
    $("#nbG").className = "nb" + (which === "gold" ? " on" : "");
    $("#liveNote").textContent = M.error
      ? "Live feed unavailable — showing the latest reference values."
      : M.updated
        ? "Updated live · " +
          new Date(M.updated).toLocaleDateString("en-CA") +
          ". Prices used in calculations are based on this Nisab reference."
        : "Reference values shown. Prices used in calculations are based on this Nisab reference.";
    $("#autoSel").textContent =
      "Auto-selected " +
      (which === "silver" ? "Silver" : "Gold") +
      " from your current eligible wealth. One lunar year is assumed.";
    $("#zakat").textContent = fmt(z);
    $("#fabAmt").textContent = compact(z);
    $("#fab").setAttribute("aria-label", "Open live Zakat estimate: " + fmt(z));
    $("#heroZ").textContent = fmt(z);
    $("#heroBar").style.width = pct + "%";
    $("#fill").style.width = pct + "%";
    $("#fill").classList.toggle("on", reached);
    $("#zsub").textContent = reached
      ? "Zakat estimate ready · one lunar year assumed"
      : "Add more eligible wealth to reach the minimum";
    $("#usedTop").textContent = fmt(used);
    $("#stat").innerHTML = reached
      ? '<span style="color:var(--gold)"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ><path d="M5 12l5 5 9-10"/></svg></span><span><strong>Nisab reached.</strong> This estimate assumes one lunar year.</span>'
      : '<span class="dot"></span><span>Add ' +
        fmt(need) +
        " more to reach the minimum.</span>";
    $("#gross").textContent = fmt(gross);
    $("#dueV").textContent = "− " + fmt(due);
    $("#usedV").textContent = fmt(used);
    $("#zV").textContent = fmt(z);
    $("#intRow").style.display = I > 0 ? "flex" : "none";
    $("#intV").textContent = fmt(I);
    $("#selN").textContent = fmt(nis) + " · " + which + " standard";
    var gb = $("#giveBtn");
    gb.disabled = !reached;
    gb.className = "give " + (reached ? "go" : "off");
    gb.innerHTML =
      (I > 0 ? "Review Zakat + interest" : "Give Zakat") +
      ' <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
    var ib = $("#intBtn");
    ib.style.display = I > 0 ? "block" : "none";
    ib.textContent =
      "Review interest donation · " +
      "$" +
      I.toLocaleString("en-CA", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }) +
      " CAD";
    window.__st = { used: used, z: z, I: I, nis: nis, which: which };
  }
  document.addEventListener("input", function (e) {
    var t = e.target,
      l = t.getAttribute && t.getAttribute("data-l");
    if (t.id === "interest") {
      S.interest = Math.max(0, Number(t.value) || 0);
      calc();
      return;
    }
    if (!l || t.tagName === "SELECT") return;
    var i = +t.getAttribute("data-i"),
      f = t.getAttribute("data-f");
    if (t.getAttribute("data-t")) {
      var v = t.value;
      if (t.getAttribute("data-up")) v = v.toUpperCase();
      S[l][i][f] = v;
    } else S[l][i][f] = Math.max(0, Number(t.value) || 0);
    calc();
  });
  document.addEventListener("change", function (e) {
    var t = e.target;
    if (t.tagName !== "SELECT") return;
    var l = t.getAttribute("data-l");
    if (!l) return;
    var i = +t.getAttribute("data-i"),
      f = t.getAttribute("data-f");
    if (f === "karat") S[l][i][f] = Number(t.value);
    else S[l][i][f] = t.value;
    if (l === "cash") S.cash[i].label = t.value === "Other" ? "" : t.value;
    renderList(l);
    calc();
  });
  document.addEventListener("click", function (e) {
    var b = e.target.closest("button");
    if (!b) return;
    var d = b.getAttribute("data-del");
    if (d) {
      var i = +b.getAttribute("data-i");
      if (S[d].length > 1) {
        S[d].splice(i, 1);
        renderList(d);
        calc();
      }
      return;
    }
    var a = b.getAttribute("data-add");
    if (a) {
      var n = {
        fx: { cur: "USD", code: "", amount: 0, rate: 0 },
        gold: { karat: 24, grams: 0 },
        silver: { grams: 0 },
        liab: { type: "other", label: "", amount: 0 },
      }[a];
      S[a].push(JSON.parse(JSON.stringify(n)));
      renderList(a);
      calc();
      return;
    }
    var ai = b.getAttribute("data-addinv");
    if (ai) {
      S.inv.push({ type: ai, amount: 0, currency: "CAD" });
      renderList("inv");
      calc();
    }
  });
  function reset() {
    S = fresh();
    renderAll();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  $("#reset1").onclick = reset;
  $("#reset2").onclick = reset;
  $("#intBtn").onclick = function () {
    open("interest");
  };
  $("#giveBtn").onclick = function () {
    open("zakat");
  };
  function open(k) {
    if (typeof closeSheet === "function") closeSheet();
    intent = k;
    var s = window.__st,
      z = k === "zakat" ? s.z : 0;
    $("#vt").textContent =
      k === "interest"
        ? "Review interest donation"
        : "Please verify your information";
    $("#mgoT").textContent =
      k === "interest" ? "Give my interest donation now" : "Give my Zakat now";
    var mz = $("#mz"),
      mi = $("#mi");
    mz.style.display = z > 0 ? "flex" : "none";
    mz.lastChild.textContent = fmt(z);
    mi.style.display = s.I > 0 ? "flex" : "none";
    mi.lastChild.textContent = fmt(s.I);
    $("#mt").textContent = fmt(z + s.I);
    $("#modal").classList.add("open");
  }
  function close() {
    $("#modal").classList.remove("open");
  }
  $("#mclose").onclick = close;
  $("#mback").onclick = close;
  $("#emailBtn").onclick = function () {
    var s = window.__st,
      body =
        "Human Appeal Canada Zakat estimate\nAmount used for Zakat: " +
        fmt(s.used) +
        "\nEstimated Zakat at 2.5%: " +
        fmt(s.z) +
        "\nInterest to donate separately: " +
        fmt(s.I) +
        "\nCombined amount to enter at checkout: " +
        fmt(s.z + s.I) +
        "\nNisab: " +
        fmt(s.nis) +
        " (" +
        s.which +
        ")\nAssumption: one lunar year";
    location.href =
      "mailto:?subject=" +
      encodeURIComponent("My Zakat calculator result") +
      "&body=" +
      encodeURIComponent(body);
  };
  $("#gbtn").onclick = function () {
    var g = $("#guidance");
    g.classList.toggle("open");
    this.setAttribute("aria-expanded", g.classList.contains("open"));
  };
  $$(".fq button").forEach(function (b) {
    b.onclick = function () {
      var f = b.parentNode,
        o = f.classList.contains("open");
      $$(".fq").forEach(function (x) {
        x.classList.remove("open");
        $("button", x).setAttribute("aria-expanded", "false");
      });
      if (!o) {
        f.classList.add("open");
        b.setAttribute("aria-expanded", "true");
      }
    };
  });
  $("#stog").onclick = function () {
    $("#srch").classList.toggle("open");
  };
  $("#mtog").onclick = function () {
    $("#mnav").classList.toggle("open");
  };
  $$('#mnav a[href^="#"]').forEach(function (a) {
    a.onclick = function () {
      $("#mnav").classList.remove("open");
    };
  });
  $("#yr").textContent = new Date().getFullYear();

  /* ===== tooltips: hover on desktop, tap on touch; fixed-position so they are never clipped ===== */
  var hoverMQ = window.matchMedia("(hover:hover) and (pointer:fine)");
  var stackMQ = window.matchMedia("(max-width:1100px)");
  var openInfo = null;
  function placePop(info) {
    var b = $(".ib", info),
      p = $(".pop", info),
      m = 8;
    var vw = document.documentElement.clientWidth,
      vh = window.innerHeight;
    var w = Math.min(288, vw - 2 * m);
    p.style.width = w + "px";
    p.style.visibility = "hidden";
    var r = b.getBoundingClientRect(),
      ph = p.offsetHeight;
    var left = Math.max(m, Math.min(r.right - w, vw - w - m));
    var top = r.bottom + 6;
    if (top + ph > vh - m && r.top - 6 - ph >= m) top = r.top - 6 - ph;
    top = Math.max(m, Math.min(top, vh - ph - m));
    p.style.left = left + "px";
    p.style.top = top + "px";
    p.style.visibility = "";
  }
  function showInfo(i) {
    if (openInfo === i) return;
    if (openInfo) hideInfo(openInfo);
    i.classList.add("open");
    $(".ib", i).setAttribute("aria-expanded", "true");
    openInfo = i;
    placePop(i);
  }
  function hideInfo(i) {
    i.classList.remove("open");
    $(".ib", i).setAttribute("aria-expanded", "false");
    if (openInfo === i) openInfo = null;
  }
  document.addEventListener("mouseover", function (e) {
    if (!hoverMQ.matches) return;
    var i = e.target.closest && e.target.closest(".info");
    if (i) showInfo(i);
  });
  document.addEventListener("mouseout", function (e) {
    if (!hoverMQ.matches) return;
    var i = e.target.closest && e.target.closest(".info");
    if (i && !(e.relatedTarget && i.contains(e.relatedTarget))) hideInfo(i);
  });
  document.addEventListener("focusin", function (e) {
    var i = e.target.closest && e.target.closest(".info");
    if (i && hoverMQ.matches) showInfo(i);
  });
  document.addEventListener("focusout", function (e) {
    var i = e.target.closest && e.target.closest(".info");
    if (
      i &&
      hoverMQ.matches &&
      !(e.relatedTarget && i.contains(e.relatedTarget))
    )
      hideInfo(i);
  });
  document.addEventListener("click", function (e) {
    var b = e.target.closest && e.target.closest(".info .ib");
    if (b) {
      if (!hoverMQ.matches) {
        var i = b.parentNode;
        if (i.classList.contains("open")) hideInfo(i);
        else showInfo(i);
      }
      return;
    }
    if (openInfo && !(e.target.closest && e.target.closest(".info")))
      hideInfo(openInfo);
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && openInfo) hideInfo(openInfo);
  });
  window.addEventListener(
    "scroll",
    function () {
      if (openInfo) hideInfo(openInfo);
    },
    true,
  );
  window.addEventListener("resize", function () {
    if (openInfo) hideInfo(openInfo);
  });

  /* ===== calculation details accordion (open by default) ===== */
  var detBtn = $("#detBtn"),
    detBox = $("#detBox");
  detBtn.addEventListener("click", function () {
    var open = detBtn.getAttribute("aria-expanded") === "true";
    detBtn.setAttribute("aria-expanded", open ? "false" : "true");
    detBox.classList.toggle("closed", open);
  });

  /* ===== floating live-estimate button + bottom sheet (single-column layouts) ===== */
  var aside = $("aside"),
    est = $(".est"),
    fab = $("#fab"),
    sheet = $("#estSheet"),
    slot = $("#sheetSlot"),
    fabShown = false;
  function compact(n) {
    try {
      return new Intl.NumberFormat("en-CA", {
        style: "currency",
        currency: "CAD",
        notation: "compact",
        maximumFractionDigits: n < 1000 ? 0 : 1,
      }).format(n);
    } catch (x) {
      return fmt(n);
    }
  }
  function openSheet() {
    if (sheet.classList.contains("open")) return;
    if (openInfo) hideInfo(openInfo);
    slot.appendChild(est);
    sheet.classList.add("open");
    document.body.style.overflow = "hidden";
    fab.setAttribute("aria-expanded", "true");
    fab.classList.remove("show");
    $("#sheetClose").focus();
  }
  function closeSheet() {
    if (!sheet.classList.contains("open")) return;
    if (openInfo) hideInfo(openInfo);
    sheet.classList.remove("open");
    aside.appendChild(est);
    document.body.style.overflow = "";
    fab.setAttribute("aria-expanded", "false");
    updateFab();
  }
  fab.addEventListener("click", openSheet);
  $("#sheetClose").addEventListener("click", closeSheet);
  $("#sheetBg").addEventListener("click", closeSheet);
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeSheet();
  });
  function updateFab() {
    if (!stackMQ.matches) {
      if (sheet.classList.contains("open")) closeSheet();
      fab.classList.remove("show");
      fabShown = false;
      return;
    }
    if (sheet.classList.contains("open")) return;
    var vh = window.innerHeight,
      c = $("#calculator").getBoundingClientRect(),
      e = est.getBoundingClientRect();
    var started = c.top < vh * 0.6,
      reached = e.top < vh - 140,
      show = started && !reached;
    if (fabShown && !show && reached) {
      est.classList.remove("arrive");
      void est.offsetWidth;
      est.classList.add("arrive");
    }
    fabShown = show;
    fab.classList.toggle("show", show);
  }

  /* ===== scroll position indicator (single-column layouts) ===== */
  var sind = $("#sind"),
    sthumb = $("i", sind),
    sindT;
  function updateInd() {
    if (!stackMQ.matches) return;
    var de = document.documentElement,
      sh = Math.max(de.scrollHeight, document.body.scrollHeight),
      vh = window.innerHeight,
      st = window.pageYOffset || de.scrollTop;
    var top = Math.round($(".shell").getBoundingClientRect().bottom) + 6,
      tr = Math.max(40, vh - top - 10);
    var th = Math.max(32, Math.min(tr, (tr * vh) / sh)),
      max = Math.max(1, sh - vh),
      y = Math.min(1, Math.max(0, st / max)) * (tr - th);
    sind.style.top = top + "px";
    sind.style.height = tr + "px";
    sthumb.style.height = th + "px";
    sthumb.style.transform = "translateY(" + y + "px)";
    sind.classList.add("active");
    clearTimeout(sindT);
    sindT = setTimeout(function () {
      sind.classList.remove("active");
    }, 1400);
  }
  window.addEventListener(
    "scroll",
    function () {
      updateFab();
      updateInd();
    },
    { passive: true },
  );
  window.addEventListener("resize", function () {
    updateFab();
    updateInd();
  });
  updateFab();
  updateInd();

  function getJSON(u) {
    return fetch(u).then(function (r) {
      if (!r.ok) throw new Error(u);
      return r.json();
    });
  }
  function loadPrices() {
    if (location.protocol === "file:") {
      M.loading = false;
      calc();
      return;
    }
    Promise.all([
      getJSON("https://api.gold-api.com/price/XAU"),
      getJSON("https://api.gold-api.com/price/XAG"),
      getJSON("https://api.frankfurter.dev/v1/latest?from=USD&to=CAD,GBP,EUR"),
    ])
      .then(function (a) {
        if (a[0] && a[0].price) M.goldOz = a[0].price;
        if (a[1] && a[1].price) M.silverOz = a[1].price;
        var r = (a[2] && a[2].rates) || {};
        if (r.CAD) M.CAD = r.CAD;
        if (r.GBP) M.GBP = r.GBP;
        if (r.EUR) M.EUR = r.EUR;
        M.updated = a[0].updatedAt || new Date().toISOString();
        M.error = false;
        setPrices();
      })
      .catch(function () {
        M.error = true;
      })
      .then(function () {
        M.loading = false;
        calc();
      });
  }
  renderAll();
  loadPrices();
  setInterval(loadPrices, 900000);
})();
