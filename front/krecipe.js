// krecipe.js

// JSON 파일을 로드합니다.
d3.json("krecipe_graph.json").then(function(graph) {
    // 그래프의 너비와 높이를 설정합니다.
    const width = window.innerWidth;
    const height = window.innerHeight;
    const nodeRadius = 20; // 노드의 크기를 20으로 증가

    // SVG 요소를 생성하고 크기를 설정합니다.
    const svg = d3.select("body").append("svg")
        .attr("viewBox", [0, 0, width, height]) // viewBox 사용
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
    // 요리명 노드와 재료 노드를 구분합니다.
    const recipeNode = svg.append("g")
        .attr("class", "recipeNodes")
        .selectAll("circle")
        .data(graph.nodes.filter(node => node.group === 1)) // 요리명 노드만 선택
        .enter()
        .append("circle")
        .attr("class", "recipeNode")
    // 설정된 노드 속성 및 이벤트 핸들러...

    const ingredientNode = svg.append("g")
        .attr("class", "ingredientNodes")
        .selectAll("circle")
        .data(graph.nodes.filter(node => node.group !== 1)) // 재료 노드만 선택
        .enter()
        .append("circle")
        .attr("class", "ingredientNode")
    // 링크를 그립니다.
    const link = svg.append("g")
        .attr("class", "links")
        .selectAll("line")
        .data(graph.links)
        .enter().append("line")
        .attr("class", "link");

    // 노드를 그립니다.
    const node = svg.append("g")
        .attr("class", "nodes")
        .selectAll("circle")
        .data(graph.nodes)
        .enter().append("circle")
        .attr("class", "node")
        .attr("r", nodeRadius)
        .style("fill", function(d) {
            // 그룹 값에 따라 다른 색상 적용
            return d.group === 1 ? "#ff5733" : "#6699cc";
        })
        .on("click", function(event, d) {
            if (d.url) {
                window.open(d.url, "_blank");
            }
        })
        // 툴팁 스타일 변경
        .on("mouseover", function(event, d) {
            tooltip.transition()
                .duration(200)
                .style("opacity", .9)
                .style("background", "rgba(0, 0, 0, 0.8)") // 호버 시 배경색 변경
                .style("color", "#fff"); // 호버 시 글자 색상 변경
            
            // "target" 속성을 사용하여 툴팁에 연결된 정보 표시
            const linkedTarget = graph.links.find(link => link.source === d.id)?.target;
            if (linkedTarget) {
                tooltip.html(d.id + "<br>" + linkedTarget)
                    .style("left", (event.pageX) + "px")
                    .style("top", (event.pageY - 28) + "px");
            } else {
                tooltip.html(d.id + "<br>No target information") // 연결된 정보가 없는 경우 메시지 표시
                    .style("left", (event.pageX) + "px")
                    .style("top", (event.pageY - 28) + "px");
            }
        })
        .on("mouseout", function() {
            tooltip.transition()
                .duration(500)
                .style("opacity", 0)
                .style("background", "rgba(0, 0, 0, 0.8)") // 마우스 아웃 시 배경색 복원
                .style("color", "#fff"); // 마우스 아웃 시 글자 색상 복원
        });

    // 레이블을 그립니다.
    const label = svg.append("g")
        .attr("class", "labels")
        .selectAll("text")
        .data(graph.nodes)
        .enter().append("text")
        .text(function(d) { return d.id; })
        .attr("x", 8)
        .attr("y", ".31em");
    
    
    // 시뮬레이션 갱신 함수
    function ticked() {
        link
            .attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });

        node
            .attr("cx", function(d) { return d.x; })
            .attr("cy", function(d) { return d.y; });

        label
            .attr("x", function(d) { return d.x; })
            .attr("y", function(d) { return d.y; });
    }

    simulation
        .on("tick", ticked);
});
