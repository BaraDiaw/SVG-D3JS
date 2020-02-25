                // Ici j'établis les dimensions et les marges de mon graphe.
                var margin = {top: 50, right: 70, bottom: 40, left: 160},
	            width = 1000, height = 550;

                //Mise en place du cadre de dessin. 
      
                var svg = d3.select("body")
	            .append("svg")
		            .attr("width", width + margin.left + margin.right)//1160
		            .attr("height", height + margin.top + margin.bottom+200)//840
	            .append("g")
		            .attr("transform", "translate(" + margin.left + "." + margin.top + ")");

        	    // Remplissage des axes
              
                var x = d3.scale.ordinal()
	            .rangeRoundBands([0, width-200], 0.40);

                var y = d3.scale.linear()
	            .range([height, 0]);

                var xAxis = d3.svg.axis()
	            .scale(x)
	            .orient("bottom");

                var yAxis = d3.svg.axis()
	            .scale(y)
	            .orient("left")
	            .ticks(20);
                
               // Je charge mon fichier .csv
               var election2 = d3.csv("election2.csv", function(data){
               // Conversion des données 
               var donnee = data;
                donnee.forEach(function(d){
                    d.regions = d.regions;
                    d.idy = +d.idy;
                    d.madicke = +d.madicke;
                    d.macky = +d.macky;
                    d.sonko = +d.sonko;
                    d.issa = +d.issa;
                });            
                
                //Mise en relation de l'échelle avec les données de notre fichier    
	            x.domain(donnee.map(function(d){ return d.regions; }));
	            y.domain([0, d3.max(donnee, function (d){ return d.idy; })]);
                	
                // Ajout de l'axe X au SVG
	            svg
                .append("g")
	                .attr("class", "x axis")
	                .attr("transform", "translate(0, " + height + ")")
                    .transition()
                    .duration(500)
                    .call(xAxis)
                    .selectAll("text")
                    .attr("transform", "translate(-10,10)rotate(-25)")
                    .style("text-anchor", "end")
                    .style("font-size", 12)
                    .style("fill", "#69a3b2");
	
	            // Ajout de l'axe Y au SVG
	            svg
                .append("g")
	                .attr("class", "ordonnees")
                    .transition()
                    .duration(500)
                    .call(yAxis);

				//Titres des axes
				svg.append("text")
    				.attr("text-anchor", "end")
    				.attr("x", width/2)
    				.attr("y", height  + 100)
    				.text("Capitales régionales")
					.style("text-anchor", "middle")
					.style(" text-align", "center")
					.style("font-family", " Verdana")
					.style("font-size", "18");

				svg.append("text")
    				.attr("text-anchor", "end")
    				.attr("transform", "rotate(-90)")
    				.attr("y", -margin.left+50)
    				.attr("x", -margin.top-80)
					.text("Nombre de voix")
					.style(" text-align", "center")
					.style("font-family", " Verdana")
					.style("font-size", "18");
				//tableau de couleurs des barres	
                var couleur = ["#1F77B4", "black", "#FF7F0E", "#FFBB78", "#98DF8A", "#386CAF", "#9467BD", "green", "#8C564B", "#C49C94", "#DF75BF", "#F5B4D0", "#7B7B7B", "red"]; 
                //Rprésentation des données en barres (ajout des barres en utilisant les données du tableau election2)
	            var group = svg.append("g");
	            group.selectAll("bar")
	            .data(donnee)
	            .enter()
	            .append("rect")
                .attr("class", "bar")
                .transition()
                .duration(1000)
	            .attr("x", function(d) { return x(d.regions); })
	            .attr("width", x.rangeBand())
	            .attr("y", function (d) {return y(d.idy);})
	            .attr("height", function (d) { return height - y(d.idy); })
                .style("fill", function(d,i) { return couleur[i]; })

                //Légende
				var legende = svg.append("g");
                legende
                .selectAll("rect")
                .data(donnee)
                .enter()
                .append("rect")
                    .attr("width", 30)
                    .attr("height", 25)
                    .attr("x", width-150)
				    .attr("y", function(d,i) { return 40 + (i*40); })
				    .style("fill", function(d,i) {return couleur[i]; });

                legende
                .selectAll("text")
                .data(donnee)
                .enter()
                .append("text")
                    .attr("width", 50)
                    .attr("height", 0)
                    .attr("x", width-100)
				    .attr("y", function(d,i){ return 60 + (i*40); })
                    .text(function(d,i) { return d.regions; })
                    .style("font-size", "18px");

				//Titre de la légende
                legende
                .append("text")
                    .text("Légende:")
                    .attr("x", width-150)
                    .attr("y", 15)
                    .style("font-size", "20px")
                    .style("text-decoration", "underline")
                    .style("font-style", "italic");

                //Chargement dynamique des barres en fonction du candidat choisi dans la liste
                d3.select("#idy").on("click", function(){
                    y.domain([0, d3.max(donnee, function (d){ return d.idy; })]);

                    d3.select(".ordonnees").selectAll("g").select("text").text(function(d,i){
                        return i*5010;
                    });

                    d3.selectAll(".bar")
                    .transition()
                    .duration(1000)
                    .attr("x", function(d) { return x(d.regions); })
                    .attr("width", x.rangeBand())
                    .attr("y", function (d) {return y(d.idy);})
                    .attr("height", function (d) { return height - y(d.idy); })
                    .style("fill", function(d,i) { return couleur[i]; })

                   var titre =d3.select("body").append("svg").append("text")
    				.attr("x", (width+100) / 2)             
    				.attr("y", 0 - (margin.top / 2))
    				.attr("text-anchor", "middle")
    				.style("fill", "black")
    				.style("font-family", "Raleway")
    				.style("font-weight", "300")
    				.style("font-size", "24px")
					.style("text-decoration", "underline")
    				.text(" Diagramme en barres des résultats de l'éléction présidentielle 2019.");
                });

                d3.select("#dike").on("click", function(){
                    y.domain([0, d3.max(donnee, function (d){ return d.madicke; })]);

                    d3.select(".ordonnees").selectAll("g").select("text").text(function(d,i){
                        return i*236;
                    });

                    d3.selectAll(".bar")
                    .transition()
                    .duration(1000)
                    .attr("x", function(d) { return x(d.regions); })
                    .attr("width", x.rangeBand())
                    .attr("y", function (d) {return y(d.madicke);})
                    .attr("height", function (d) { return height - y(d.madicke); })
                    .style("fill", function(d,i) { return couleur[i]; }); 
                });

                d3.select("#macky").on("click", function(){
                    y.domain([0, d3.max(donnee, function (d){ return d.macky; })]);

                    d3.select(".ordonnees").selectAll("g").select("text").text(function(d,i){
                        return i*8850;
                    });

                    d3.selectAll(".bar")
                    .transition()
                    .duration(1000)
                    .attr("x", function(d) { return x(d.regions); })
                    .attr("width", x.rangeBand())
                    .attr("y", function (d) {return y(d.macky);})
                    .attr("height", function (d) { return height - y(d.macky); })
                    .style("fill", function(d,i) { return couleur[i]; }); 
                });

                d3.select("#ouz").on("click", function(){
                    y.domain([0, d3.max(donnee, function (d){ return d.sonko; })]);

                    d3.select(".ordonnees").selectAll("g").select("text").text(function(d,i){
                        return i*4210;
                    });

                    d3.selectAll(".bar")
                    .transition()
                    .duration(1000)
                    .attr("x", function(d) { return x(d.regions); })
                    .attr("width", x.rangeBand())
                    .attr("y", function (d) {return y(d.sonko);})
                    .attr("height", function (d) { return height - y(d.sonko); })
                    .style("fill", function(d,i) { return couleur[i]; }); 
                });
                
                d3.select("#issa").on("click", function(){
                    y.domain([0, d3.max(donnee, function (d){ return d.issa; })]);

                    d3.select(".ordonnees").selectAll("g").select("text").text(function(d,i){
                        return i*778;
                    });

                    d3.selectAll(".bar")
                    .transition()
                    .duration(1000)
                    .attr("x", function(d) { return x(d.regions); })
                    .attr("width", x.rangeBand())
                    .attr("y", function (d) {return y(d.issa);})
                    .attr("height", function (d) { return height - y(d.issa); })
                    .style("fill", function(d,i) { return couleur[i]; }); 
                });

            });
