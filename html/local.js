"use strict";

var updateEverything = function(){}
$(document).ready(function() {
    $.ajaxSetup({ cache: false });
    
    var m = new Metronome( {url: "http://127.0.0.1:8000/", datapoints: 150 });

    $(window).bind('popstate',  
		   function(event) {
		       if(event.originalEvent.state != undefined) {
			   $("#server").val(event.originalEvent.state.server);
			   $("#duration").val(event.originalEvent.state.beginTime);
			   configAll();
			   updateEverything();
		       }
		   });

    function configAll()
    {
	var servername=$("#server").val();
	if(servername=='')
	    return;

        if(servername=='All') {
            var allqueries=[];
            var servfails=[];
            
            $.each(m.servers, function(key,val) {
                var re=/.auth$/;
                if(re.test(val))
                    allqueries.push(val+".udp-queries");
                else if((/.recursor$/).test(val)) {
                        allqueries.push(val+".questions");
                        servfails.push(val+".servfail-answers");
                    }
                });
                
            var config ={ items: [ 
            { metrics: servfails, legend: "Total servfails/s",
	      formula: function(r,d) { 
	          var ret=0;
	          $.each(d, function(key,val) { if(key<servfails.length) ret+= val; });
	          return ret;
	          }
	    },
	    { metrics: allqueries, legend: "Total queries/s",
	      formula: function(r,d) { 
	          var ret=0;
	          $.each(d, function(key,val) { if(key>=servfails.length) ret+= val; });
	          return ret;
	          }
	    }
            ]};
            
            m.setupGraphs("#graphs", [config]);	
            return;
        }

	var config1 = { items: [ 
            { name: servername+".servfail-answers", legend: "Servfail answers/s"},
            { name: servername+".questions", legend: "Questions/s" }, 
            { name: servername+".policy-drops", legend: "Policy drops/s" },
            { name: servername+".all-outqueries", legend: "All outqueries/s"}
        ]};	
	
	var config2 = { renderer: 'stack', items: [ 
            { name: servername+".answers-slow", legend: "Slow answers/s"},
	    { name: servername+".packetcache-hits", legend: "0ms answers/s"},
            { name: servername+".answers0-1", legend: "<1 ms answers/s"},
            { name: servername+".answers1-10", legend: "1-10ms answers/s"},
            { name: servername+".answers10-100", legend: "10-100ms answers/s"},
            { name: servername+".answers100-1000", legend: "100-1000ms answers/s"}
	    
	]};
	
	var config2a = { renderer: 'stack', items: [ 
            { name: servername+".servfail-answers", legend: "SERVFAIL answers/s"},
            { name: servername+".nxdomain-answers", legend: "NXDOMAIN answers/s"},
            { name: servername+".noerror-answers", legend: "Normal answers/s"}	    
	]};
	
	var config2b = { items: [ 
            { name: servername+".tcp-questions", legend: "TCP/IP questions/s"},
            { name: servername+".tcp-outqueries", legend: "TCP/IP outqueries/s"},
            { name: servername+".tcp-client-overflow", legend: "TCP/IP overflows/s"}	    
	]};

	
	var config3 ={ renderer: "stack", items: [ 
            { metrics: [servername+".sys-msec"], legend: "System CPU%",
	      formula: function(r,d) { return d[0]/10.0; }
	    }, 
            { metrics: [servername+".user-msec"], legend: "User CPU%",
	      formula: function(r,d) { return d[1]/10.0; }
	    }]};
	
	var config3a = { items: [ 
            { name: servername+".throttled-out", legend: "Throttled/s" }, 
            { name: servername+".resource-limits", legend: "Resource limited/s"}]};

	var config3b ={ items: [
            { name: servername+".concurrent-queries", legend: "Concurrent queries", kind: "gauge"}
        ]};

	
	var config4 = { items: [ 
            { 
		metrics: [servername+".packetcache-hits",servername+".packetcache-misses"], 
		legend: "% packetcache hitrate", 
		formula: m.percentalizer
	    }]};    

	var config5 = { items: [ 
            { 
		metrics: [servername+".cache-hits",servername+".cache-misses"], 
		legend: "% cache hitrate", 
		formula: m.percentalizer
	    }]};    


	var config6 ={ renderer: "stack", items: [
            { name: servername+".cache-entries", legend: "Cache entries", kind: "gauge"}, 
            { name: servername+".packetcache-entries", legend: "Packetcache entries", kind: "gauge"}]};


	var config7 = { items: [ 
            { name: servername+".udp-queries", legend: "UDP Questions/s" }, 
            { name: servername+".udp-answers", legend: "UDP Answers/s"}]};

	var config7a = { items: [ 
            { name: servername+".tcp-queries", legend: "TCP Questions/s" }, 
            { name: servername+".tcp-answers", legend: "TCP Answers/s"}]};

        var config7aa = { items: [ 
            { name: servername+".rd-queries", legend: "RD Questions/s" }, 
            { name: servername+".recursing-answers", legend: "RD Answers/s"},
            { name: servername+".recursing-questions", legend: "RD Questions/s"},
            { name: servername+".recursion-unanswered", legend: "RD Unanswered/s"}            
            
            ]};

	var config7b = { items: [ 
            { name: servername+".qsize-q", legend: "DB Queue", kind: "gauge"}
            ]};

	var config7c = { items: [ 
            { name: servername+".timedout-packets", legend: "Timedout queries"},
            { name: servername+".servfail-packets", legend: "Servfail answers"},
            ]};

	var config7d = { items: [ 
            { name: servername+".latency", legend: "Latency (usec)", kind: "gauge"}
            ]};


	var config8 = { items: [ 
            { 
		metrics: [servername+".packetcache-hit",servername+".packetcache-miss"], 
		legend: "% packet cache hitrate", 
		formula: m.percentalizer
	    }]};    

	var config9 = { items: [ 
            { 
		metrics: [servername+".query-cache-hit",servername+".query-cache-miss"], 
		legend: "% query cache hitrate", 
		formula: m.percentalizer
 	    }]};    

	var config10 = { items: [ 
		{name: servername+".query-cache-miss", legend: "Database queries/s"}
	]};

	var config10a = { items: [ 
            { 
		metrics: [servername+".query-cache-miss",servername+".udp-answers"], 
		legend: "% query to DB amplification", 
		formula: function(r, d) {
		        if(d[0] > 0 && d[1] >0) {
		                return d[0]*100.0/d[1];
                        }
                        return 0;
                    }
	    }]};    


	var config11 = { items: [ 
		{name: servername+".deferred-cache-inserts", legend: "Deferred cache inserts/s"},
		{name: servername+".deferred-cache-lookup", legend: "Deferred cache lookups/s"},
	]};

	var config12 ={ items: [
	        { name: servername+".packetcache-size", legend: "Packet cache size", kind: "gauge"}
        ]};

	var config13 ={ items: [
	        { name: servername+".meta-cache-size", legend: "Meta cache size", kind: "gauge"},
	        { name: servername+".key-cache-size", legend: "Key cache size", kind: "gauge"},	        
	        { name: servername+".signature-cache-size", legend: "Signature cache size", kind: "gauge"},	        
        ]};

	var config14 = { items: [ 
		{name: servername+".signatures", legend: "DNSSEC signatures/s"},
	]};
	            

	var configs;
	var components = servername.split('.');
	if(components[2]=="recursor") { 
	    configs=[config1, config2, config2a, config2b, config3, config3a, config3b, config4, config5, config6];
	}
	else if(components[2]=="auth") { 
	    configs=[config3, config7, config7a, config7aa, config7b, config7c, config7d, config8, config9, config10, config10a, config11, config12, config13, config14];
	}
	else if(components[0]=="system" && components[2]=="network") { 
	    configs=[ { 
		items: [ 
		    {name: servername+".udp.in-errors", legend: "UDP Input error/s"},
		    {name: servername+".udp.sndbuf-errors", legend: "UDP SNDBuf error/s"},
		    {name: servername+".udp.rcvbuf-errors", legend: "UDP RCVBuf error/s"},
		    {name: servername+".udp.noport-errors", legend: "UDP Noport error/s"}
		]
	    }];

            var interfaces=m.listMetricsAt(components[0], components[1], components[2], "interfaces");
            $.each(interfaces, function(key, val) {
		configs.push({
		items: [ 
		    { name: servername+".interfaces."+val+".tx_bytes", legend: val+" TX bits/s", bytesToBits: true},
		    { name: servername+".interfaces."+val+".rx_bytes", legend: val+" RX bits/s", bytesToBits: true},
		    ]
		});
		configs.push({items: [ 
		    { name: servername+".interfaces."+val+".tx_packets", legend: val+" TX packets/s"},
		    { name: servername+".interfaces."+val+".rx_packets", legend: val+" RX packets/s"},
		    ]
			     });
	    });		      
	}
	
	m.setupGraphs("#graphs", configs);	
    }

    var interval;     

    window.updateEverything = function() { 
	m.comconfig.beginTime = parseInt($("#duration").val());
	
	if(interval != undefined)
	    clearInterval(interval);
	interval = setInterval(updateEverything, m.getNaturalInterval());    

	m.updateGraphs();
    };    

    window.updateFromForm = function() {
	configAll();

	var stateObj = { server: $("#server").val(), beginTime: parseInt($("#duration").val()) };
	history.pushState(stateObj, "Metronome", "?server="+stateObj.server+"&beginTime="+stateObj.beginTime);
	updateEverything();
    }


    m.getAllMetrics(function() { 
	var ret="";
	ret+="<option value='All'>All</option>";
	$.each(m.servers, function(a,b) {
	    ret+= "<option value='"+b+"'>"+b+"</option>";
	});
	$("#server").html(ret);

	if($.url().param('server') != undefined) {
	    $("#server").val($.url().param('server'));
	}
	if($.url().param('beginTime') != undefined)
	    $("#duration").val($.url().param('beginTime'));
	
	var stateObj = { server: $("#server").val(), beginTime: parseInt($("#duration").val()) };
	history.replaceState(stateObj, "Metronome", "?server="+stateObj.server+"&beginTime="+stateObj.beginTime);
	
	configAll();
	updateEverything();
    });
});
