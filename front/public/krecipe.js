// krecipe.js

// JSON 파일을 로드
d3.json("krecipe_graph.json").then(function(graph) {
    // 그래프의 너비와 높이를 설정
    const width = window.innerWidth;
    const height = window.innerHeight;
    const nodeRadius = 20;

    const colors = {
        nodeDefault: '#66cc66',
        nodeHighlight: '#ff5733',
        linkDefault: '#999',
        linkHighlight: '#ff5733'
    };

    // 드롭다운 메뉴 옵션 설정
    const group1Nodes = graph.nodes.filter(node => node.group === 1);
    const group2Nodes = graph.nodes.filter(node => node.group === 2);
    d3.select("#group1-select")
      .selectAll("option")
      .data(group1Nodes)
      .enter()
      .append("option")
      .text(d => d.id)
      .attr("value", d => d.id);

    d3.select("#group2-select")
      .selectAll("option")
      .data(group2Nodes)
      .enter()
      .append("option")
      .text(d => d.id)
      .attr("value", d => d.id);

    // 드롭다운 변경 시 시각화 업데이트
    d3.select("#group1-select").on("change", function(event) {
        const selectedValue = event.target.value;
        updateVisualization(selectedValue, 1);
    });

    d3.select("#group2-select").on("change", function(event) {
        const selectedValue = event.target.value;
        updateVisualization(selectedValue, 2);
    });

    function updateVisualization(selectedNodeId, group) {
        // Apply styles to nodes and links based on selection
        node.classed("highlight", d => d.id === selectedNodeId || isConnected(d, selectedNodeId));
        link.classed("highlight", d => d.source.id === selectedNodeId || d.target.id === selectedNodeId);
    }

    // SVG 요소를 생성하고 크기를 설정합니다.
    const svg = d3.select("body").append("svg")
        .attr("viewBox", [0, 0, width, height])
        .style("width", "100%")
        .style("height", "100vh");

    // 툴팁 설정
    const tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0)
        .style("position", "absolute")
        .style("text-align", "center")
        .style("width", "120px")
        .style("height", "28px")
        .style("padding", "2px")
        .style("font", "12px sans-serif")
        .style("background", "lightsteelblue")
        .style("border", "0px")
        .style("border-radius", "8px")
        .style("pointer-events", "none");

    // 시뮬레이션 설정
    const simulation = d3.forceSimulation(graph.nodes)
        .force("link", d3.forceLink(graph.links).id(function(d) { return d.id; }).distance(50))
        .force("charge", d3.forceManyBody().strength(-50))
        .force("center", d3.forceCenter(width / 2, height / 2));

    // 확대/축소 기능을 위한 줌 핸들러
    const zoomHandler = d3.zoom()
        .on("zoom", (event) => {
            svg.attr("transform", event.transform);
        });

    // SVG에 줌 핸들러를 적용
    svg.call(zoomHandler);
    
    const recipeNode = svg.append("g")
        .attr("class", "recipeNodes")
        .selectAll("circle")
        .data(graph.nodes.filter(node => node.group === 1))
        .enter()
        .append("circle")
        .attr("class", "recipeNode")
    

    const ingredientNode = svg.append("g")
        .attr("class", "ingredientNodes")
        .selectAll("circle")
        .data(graph.nodes.filter(node => node.group !== 1))
        .enter()
        .append("circle")
        .attr("class", "ingredientNode")
    // 링크
    const link = svg.append("g")
        .attr("class", "links")
        .selectAll("line")
        .data(graph.links)
        .enter().append("line")
        .attr("class", "link");

    // 노드 드래그 이벤트 핸들러
    function drag(simulation) {
        function dragstarted(event, d) {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
        }

        function dragged(event, d) {
            d.fx = event.x;
            d.fy = event.y;
        }

        function dragended(event, d) {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
        }

        return d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended);
    }

    function findConnectedNodes(node, graph) {
        const connectedNodes = [];
        graph.links.forEach(link => {
            if (link.source.id === node.id && node.group === 1) {
                connectedNodes.push(link.target.id);
            } else if (link.target.id === node.id && node.group === 2) {
                connectedNodes.push(link.source.id);
            }
        });
        return connectedNodes.join(', ');
    }

    // 노드
    const node = svg.append("g")
        .attr("class", "nodes")
        .selectAll("circle")
        .data(graph.nodes)
        .enter().append("circle")
        .attr("class", "node")
        .attr("r", d => d.group === 1 ? 35 : nodeRadius)
        .style("fill", d => d.group === 1 ? colors.nodeDefault : colors.nodeHighlight)
        .call(drag(simulation))
        .on("mouseover", function(event, d) {
            d3.select(this).transition()
                .duration(150)
                .attr("r", nodeRadius * 1.2);
            tooltip
                .html("Node ID: " + d.id + "<br>Connections: " + findConnectedNodes(d, graph))
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 15) + "px")
                .classed("visible", true);
        })
        .on("mouseout", function() {
            d3.select(this).transition()
                .duration(150)
                .attr("r", nodeRadius);
            tooltip.classed("visible", false);
        })
        .on("click", function(event, d) {
            if (d.url) {
                window.open(d.url, "_blank");
            }
            updateVisualization(d.id, d.group);
        });

    // 레이블
    const label = svg.append("g")
        .attr("class", "labels")
        .selectAll("text")
        .data(graph.nodes)
        .enter().append("text")
        .text(function(d) { return d.id; })
        .attr("x", 8)
        .attr("y", ".31em")
        .style("font", "12px 'BMJUA', sans-serif")       
    
    const collide = d3.forceCollide(nodeRadius + 5).iterations(4); // 충돌 감지 반복 횟수 조절
    simulation.force("collide", collide);    

    simulation.on("tick", () => {
        link
            .attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y);

        node
            .attr("cx", d => d.x)
            .attr("cy", d => d.y);

        label
            .attr("x", d => d.x)
            .attr("y", d => d.y);
    });

    
    function isConnected(a, b) {
        return graph.links.some(link => {
            return (link.source.id === a.id && link.target.id === b.id) || (link.source.id === b.id && link.target.id === a.id);
        });
    }

    
    const restoreButton = document.getElementById("restoreButton");
    restoreButton.addEventListener("click", function() {
        
        node.style("display", "block");
        link.style("display", "block");
        label.style("display", "block");

        
        node.classed("highlight", false);
        link.classed("highlight", false);
        
        
        simulation.alpha(1).restart();
    });

    simulation.alpha(1).restart();
});
