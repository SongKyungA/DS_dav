// script.js 파일 내용

// 데이터 로드 및 초기화
d3.csv("test2.csv").then(function(data) {
    createDropdown("#ckgMethod", uniqueValues(data, 'CKG_MTH_ACTO_NM'));
    createDropdown("#ckgSituation", uniqueValues(data, 'CKG_STA_ACTO_NM'));
    createDropdown("#ckgMaterial", uniqueValues(data, 'CKG_MTRL_ACTO_NM'));

    updateBarChart(data); // 초기 차트 로드

    d3.selectAll("select").on("change", function() {
        updateBarChart(data);
    });
}).catch(error => {
    console.error("Data loading error:", error);
});

function createDropdown(selector, options) {
    let select = d3.select(selector);
    select.append("option").text("All").attr("value", "");
    options.forEach(option => {
        select.append("option").text(option).attr("value", option);
    });
}

function uniqueValues(data, column) {
    return [...new Set(data.map(d => d[column]))];
}

function updateBarChart(data) {
    let method = d3.select("#ckgMethod").property("value");
    let situation = d3.select("#ckgSituation").property("value");
    let material = d3.select("#ckgMaterial").property("value");

    let filteredData = data.filter(d => 
        (method === "" || d.CKG_MTH_ACTO_NM === method) &&
        (situation === "" || d.CKG_STA_ACTO_NM === situation) &&
        (material === "" || d.CKG_MTRL_ACTO_NM === material)
    );

    // 중복 제거 (예: 요리 이름을 기준으로)
    let uniqueData = Array.from(new Map(filteredData.map(item => [item['CKG_NM'], item])).values());

    // 세 가지 기준에 따른 막대 그래프 렌더링
    renderBarChart(getTop10(uniqueData, 'INQ_CNT'), 'INQ_CNT');
}


function getTop10(data, field) {
    return data.sort((a, b) => d3.descending(+a[field], +b[field])).slice(0, 10);
}

function renderBarChart(data, field) {
    d3.select("#barChart").selectAll("svg").remove();

    // SVG 설정
    const margin = {top: 20, right: 20, bottom: 60, left: 40};
    const width = 960 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;
    const svgWidth = 1200; // 더 넓은 SVG 너비로 조정
    const svgHeight = 500; // 높이 조정 가능

    const svg = d3.select("#barChart").append("svg")
        .attr("width", svgWidth)
        .attr("height", svgHeight)
        .style("background", "#f5f5f5") // 배경색
        .style("border", "1px solid #ccc") // 테두리
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // 축 설정
    const x = d3.scaleBand().range([0, width]).padding(0.1);
    const y = d3.scaleLinear().range([height, 0]);

    x.domain(data.map(d => d.CKG_NM));
    y.domain([0, d3.max(data, d => +d[field])]);

    // 축 스타일링
    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("y", 0)
        .attr("x", 9)
        .attr("dy", ".35em")
        .attr("transform", "rotate(45)")
        .style("text-anchor", "start");

    svg.append("g")
        .call(d3.axisLeft(y));

    // 툴팁 설정
    const tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    // 막대 애니메이션
    svg.selectAll(".bar")
        .data(data)
        .enter().append("rect")
            .attr("class", "bar")
            .attr("x", d => x(d.CKG_NM))
            .attr("width", x.bandwidth())
            .attr("y", height)
            .attr("fill", (d, i) => d3.schemeCategory10[i % 10]) // 색상
            .on("mouseover", function(event, d) {
                tooltip.transition().duration(200).style("opacity", .9);
                tooltip.html(`${d.CKG_NM}<br/>${field}: ${d[field]}`) // ES6 템플릿 리터럴 사용
                    .style("left", (d3.pointer(event, this)[0] + 70) + "px")
                    .style("top", (d3.pointer(event, this)[1]) + "px");
            })
            .on("mouseout", function(d) {
                tooltip.transition().duration(500).style("opacity", 0);
            })
            .transition()
            .duration(800)
            .attr("y", d => y(+d[field]))
            .attr("height", d => height - y(+d[field]));
}




