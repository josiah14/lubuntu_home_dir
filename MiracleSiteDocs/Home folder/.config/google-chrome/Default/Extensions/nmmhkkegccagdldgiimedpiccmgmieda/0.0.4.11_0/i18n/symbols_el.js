(function() { var a=this,b=function(k,g){var e=k.split("."),d=a;e[0]in d||!d.execScript||d.execScript("var "+e[0]);for(var f;e.length&&(f=e.shift());)e.length||void 0===g?d=d[f]?d[f]:d[f]={}:d[f]=g};var c;
c={s:["\u03c0.\u03a7.","\u03bc.\u03a7."],r:["\u03c0.\u03a7.","\u03bc.\u03a7."],w:"\u0399\u03a6\u039c\u0391\u039c\u0399\u0399\u0391\u03a3\u039f\u039d\u0394".split(""),H:"\u0399\u03a6\u039c\u0391\u039c\u0399\u0399\u0391\u03a3\u039f\u039d\u0394".split(""),v:"\u0399\u03b1\u03bd\u03bf\u03c5\u03b1\u03c1\u03af\u03bf\u03c5 \u03a6\u03b5\u03b2\u03c1\u03bf\u03c5\u03b1\u03c1\u03af\u03bf\u03c5 \u039c\u03b1\u03c1\u03c4\u03af\u03bf\u03c5 \u0391\u03c0\u03c1\u03b9\u03bb\u03af\u03bf\u03c5 \u039c\u03b1\u0390\u03bf\u03c5 \u0399\u03bf\u03c5\u03bd\u03af\u03bf\u03c5 \u0399\u03bf\u03c5\u03bb\u03af\u03bf\u03c5 \u0391\u03c5\u03b3\u03bf\u03cd\u03c3\u03c4\u03bf\u03c5 \u03a3\u03b5\u03c0\u03c4\u03b5\u03bc\u03b2\u03c1\u03af\u03bf\u03c5 \u039f\u03ba\u03c4\u03c9\u03b2\u03c1\u03af\u03bf\u03c5 \u039d\u03bf\u03b5\u03bc\u03b2\u03c1\u03af\u03bf\u03c5 \u0394\u03b5\u03ba\u03b5\u03bc\u03b2\u03c1\u03af\u03bf\u03c5".split(" "),G:"\u0399\u03b1\u03bd\u03bf\u03c5\u03ac\u03c1\u03b9\u03bf\u03c2 \u03a6\u03b5\u03b2\u03c1\u03bf\u03c5\u03ac\u03c1\u03b9\u03bf\u03c2 \u039c\u03ac\u03c1\u03c4\u03b9\u03bf\u03c2 \u0391\u03c0\u03c1\u03af\u03bb\u03b9\u03bf\u03c2 \u039c\u03ac\u03b9\u03bf\u03c2 \u0399\u03bf\u03cd\u03bd\u03b9\u03bf\u03c2 \u0399\u03bf\u03cd\u03bb\u03b9\u03bf\u03c2 \u0391\u03cd\u03b3\u03bf\u03c5\u03c3\u03c4\u03bf\u03c2 \u03a3\u03b5\u03c0\u03c4\u03ad\u03bc\u03b2\u03c1\u03b9\u03bf\u03c2 \u039f\u03ba\u03c4\u03ce\u03b2\u03c1\u03b9\u03bf\u03c2 \u039d\u03bf\u03ad\u03bc\u03b2\u03c1\u03b9\u03bf\u03c2 \u0394\u03b5\u03ba\u03ad\u03bc\u03b2\u03c1\u03b9\u03bf\u03c2".split(" "),
C:"\u0399\u03b1\u03bd \u03a6\u03b5\u03b2 \u039c\u03b1\u03c1 \u0391\u03c0\u03c1 \u039c\u03b1\u03ca \u0399\u03bf\u03c5\u03bd \u0399\u03bf\u03c5\u03bb \u0391\u03c5\u03b3 \u03a3\u03b5\u03c0 \u039f\u03ba\u03c4 \u039d\u03bf\u03b5 \u0394\u03b5\u03ba".split(" "),J:"\u0399\u03b1\u03bd \u03a6\u03b5\u03b2 \u039c\u03ac\u03c1 \u0391\u03c0\u03c1 \u039c\u03ac\u03b9 \u0399\u03bf\u03cd\u03bd \u0399\u03bf\u03cd\u03bb \u0391\u03cd\u03b3 \u03a3\u03b5\u03c0 \u039f\u03ba\u03c4 \u039d\u03bf\u03ad \u0394\u03b5\u03ba".split(" "),
N:"\u039a\u03c5\u03c1\u03b9\u03b1\u03ba\u03ae \u0394\u03b5\u03c5\u03c4\u03ad\u03c1\u03b1 \u03a4\u03c1\u03af\u03c4\u03b7 \u03a4\u03b5\u03c4\u03ac\u03c1\u03c4\u03b7 \u03a0\u03ad\u03bc\u03c0\u03c4\u03b7 \u03a0\u03b1\u03c1\u03b1\u03c3\u03ba\u03b5\u03c5\u03ae \u03a3\u03ac\u03b2\u03b2\u03b1\u03c4\u03bf".split(" "),L:"\u039a\u03c5\u03c1\u03b9\u03b1\u03ba\u03ae \u0394\u03b5\u03c5\u03c4\u03ad\u03c1\u03b1 \u03a4\u03c1\u03af\u03c4\u03b7 \u03a4\u03b5\u03c4\u03ac\u03c1\u03c4\u03b7 \u03a0\u03ad\u03bc\u03c0\u03c4\u03b7 \u03a0\u03b1\u03c1\u03b1\u03c3\u03ba\u03b5\u03c5\u03ae \u03a3\u03ac\u03b2\u03b2\u03b1\u03c4\u03bf".split(" "),
F:"\u039a\u03c5\u03c1 \u0394\u03b5\u03c5 \u03a4\u03c1\u03af \u03a4\u03b5\u03c4 \u03a0\u03ad\u03bc \u03a0\u03b1\u03c1 \u03a3\u03ac\u03b2".split(" "),K:"\u039a\u03c5\u03c1 \u0394\u03b5\u03c5 \u03a4\u03c1\u03af \u03a4\u03b5\u03c4 \u03a0\u03ad\u03bc \u03a0\u03b1\u03c1 \u03a3\u03ac\u03b2".split(" "),A:"\u039a\u0394\u03a4\u03a4\u03a0\u03a0\u03a3".split(""),I:"\u039a\u0394\u03a4\u03a4\u03a0\u03a0\u03a3".split(""),D:["\u03a41","\u03a42","\u03a43","\u03a44"],B:["1\u03bf \u03c4\u03c1\u03af\u03bc\u03b7\u03bd\u03bf",
"2\u03bf \u03c4\u03c1\u03af\u03bc\u03b7\u03bd\u03bf","3\u03bf \u03c4\u03c1\u03af\u03bc\u03b7\u03bd\u03bf","4\u03bf \u03c4\u03c1\u03af\u03bc\u03b7\u03bd\u03bf"],p:["\u03c0.\u03bc.","\u03bc.\u03bc."],q:["EEEE, d MMMM y","d MMMM y","d MMM y","d/M/yy"],M:["h:mm:ss a zzzz","h:mm:ss a z","h:mm:ss a","h:mm a"],R:["{1} - {0}","{1} - {0}","{1} - {0}","{1} - {0}"],t:0,O:[5,6],u:3};var h={c:".",f:",",j:"%",o:"0",m:"+",h:"-",e:"E",l:"\u2030",g:"\u221e",i:"NaN",b:"#,##0.###",n:"#E0",k:"#,##0%",a:"\u00a4#,##0.00;(\u00a4#,##0.00)",d:"USD"},h={c:",",f:".",j:"%",o:"0",m:"+",h:"-",e:"e",l:"\u2030",g:"\u221e",i:"NaN",b:"#,##0.###",n:"[#E0]",k:"#,##0%",a:"#,##0.00\u00a0\u00a4",d:"EUR"};b("I18N_DATETIMESYMBOLS_ERAS",c.s);b("I18N_DATETIMESYMBOLS_ERANAMES",c.r);b("I18N_DATETIMESYMBOLS_NARROWMONTHS",c.w);b("I18N_DATETIMESYMBOLS_STANDALONENARROWMONTHS",c.H);b("I18N_DATETIMESYMBOLS_MONTHS",c.v);b("I18N_DATETIMESYMBOLS_STANDALONEMONTHS",c.G);b("I18N_DATETIMESYMBOLS_SHORTMONTHS",c.C);b("I18N_DATETIMESYMBOLS_STANDALONESHORTMONTHS",c.J);b("I18N_DATETIMESYMBOLS_WEEKDAYS",c.N);b("I18N_DATETIMESYMBOLS_STANDALONEWEEKDAYS",c.L);b("I18N_DATETIMESYMBOLS_SHORTWEEKDAYS",c.F);
b("I18N_DATETIMESYMBOLS_STANDALONESHORTWEEKDAYS",c.K);b("I18N_DATETIMESYMBOLS_NARROWWEEKDAYS",c.A);b("I18N_DATETIMESYMBOLS_STANDALONENARROWWEEKDAYS",c.I);b("I18N_DATETIMESYMBOLS_SHORTQUARTERS",c.D);b("I18N_DATETIMESYMBOLS_QUARTERS",c.B);b("I18N_DATETIMESYMBOLS_AMPMS",c.p);b("I18N_DATETIMESYMBOLS_DATEFORMATS",c.q);b("I18N_DATETIMESYMBOLS_TIMEFORMATS",c.M);b("I18N_DATETIMESYMBOLS_AVAILABLEFORMATS",c.Q);b("I18N_DATETIMESYMBOLS_FIRSTDAYOFWEEK",c.t);b("I18N_DATETIMESYMBOLS_WEEKENDRANGE",c.O);
b("I18N_DATETIMESYMBOLS_FIRSTWEEKCUTOFFDAY",c.u);void 0!==c.P&&b("I18N_DATETIMESYMBOLS_ZERODIGIT",c.P);b("I18N_NUMBERFORMATSYMBOLS_DECIMAL_SEP",h.c);b("I18N_NUMBERFORMATSYMBOLS_GROUP_SEP",h.f);b("I18N_NUMBERFORMATSYMBOLS_PERCENT",h.j);b("I18N_NUMBERFORMATSYMBOLS_ZERO_DIGIT",h.o);b("I18N_NUMBERFORMATSYMBOLS_PLUS_SIGN",h.m);b("I18N_NUMBERFORMATSYMBOLS_MINUS_SIGN",h.h);b("I18N_NUMBERFORMATSYMBOLS_EXP_SYMBOL",h.e);b("I18N_NUMBERFORMATSYMBOLS_PERMILL",h.l);b("I18N_NUMBERFORMATSYMBOLS_INFINITY",h.g);
b("I18N_NUMBERFORMATSYMBOLS_NAN",h.i);b("I18N_NUMBERFORMATSYMBOLS_DECIMAL_PATTERN",h.b);b("I18N_NUMBERFORMATSYMBOLS_SCIENTIFIC_PATTERN",h.n);b("I18N_NUMBERFORMATSYMBOLS_PERCENT_PATTERN",h.k);b("I18N_NUMBERFORMATSYMBOLS_CURRENCY_PATTERN",h.a);b("I18N_NUMBERFORMATSYMBOLS_DEF_CURRENCY_CODE",h.d); })();
