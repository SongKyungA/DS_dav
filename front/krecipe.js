// krecipe.js

// JSON 파일을 로드
d3.json("krecipe_graph.json").then(function(graph) {
    // 그래프의 너비와 높이를 설정
    const width = window.innerWidth;
    const height = window.innerHeight;
    const nodeRadius = 20;

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

    // 노드
    const node = svg.append("g")
        .attr("class", "nodes")
        .selectAll("circle")
        .data(graph.nodes)
        .enter().append("circle")
        .attr("class", "node")
        .attr("r", nodeRadius)
        .style("fill", function(d) {return d.group === 1 ? "#ff5733" : "#6699cc";})
        .call(drag(simulation))
        .on("click", function(event, d) {
            if (d.url) {
                window.open(d.url, "_blank");
            }
            // 선택한 노드의 ID를 업데이트하고 연결된 노드를 필터링
            selectedNodeId = d.id;

            // 연결된 노드만 표시
            node.style("display", function(nodeData) {
                return isConnected(nodeData, d) ? "block" : "none";
            });

            label.style("display", function(nodeData) {
                return isConnected(nodeData, d) ? "block" : "none";
            });

            link.style("display", function(linkData) {
                return linkData.source.id === selectedNodeId || linkData.target.id === selectedNodeId ? "block" : "none";
            });
        })
        // 툴팁 스타일
        .on("mouseover", function(event, d) {
            tooltip.transition()
                .duration(200)
                .style("opacity", .9)
                .style("background", "rgba(0, 0, 0, 0.8)")
                .style("color", "#fff");
            
            
            const linkedTarget = graph.links.find(link => link.source === d.id)?.target;
            if (linkedTarget) {
                tooltip.html(d.id + "<br>" + linkedTarget)
                    .style("left", (event.pageX) + "px")
                    .style("top", (event.pageY - 28) + "px");
            } else {
                tooltip.html(d.id + "<br>No target information")
                    .style("left", (event.pageX) + "px")
                    .style("top", (event.pageY - 28) + "px");
            }
        })
        .on("mouseout", function() {
            tooltip.transition()
                .duration(500)
                .style("opacity", 0)
                .style("background", "rgba(0, 0, 0, 0.8)")
                .style("color", "#fff");
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

    // 시뮬레이션 갱신 함수
    function ticked() {
        link
            .attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });

        node
            .transition()
            .duration(1000) // 애니메이션 지속 시간
            .attr("cx", function(d) { return d.x; })
            .attr("cy", function(d) { return d.y; });

        label
            .attr("x", function(d) { return d.x; })
            .attr("y", function(d) { return d.y; });
    }

    simulation
        .on("tick", ticked);
    
    // 노드 간의 연결 여부를 확인하는 함수
    function isConnected(node1, node2) {
        return graph.links.some(link => (link.source === node1 && link.target === node2) || (link.source === node2 && link.target === node1));
    }
    // 선택 원복 버튼을 가져옴
    const restoreButton = document.getElementById("restoreButton");

    // 선택 원복 버튼 클릭 이벤트 핸들러
    restoreButton.addEventListener("click", function() {
        // 선택한 노드와 연결된 노드를 다시 표시
        node.style("display", "block");
        label.style("display", "block");
        link.style("display", "block");
        
        // 선택 취소
        selectedNodeId = null;
    });
    
});
