// script.js 파일 내용

// 데이터 로드 및 초기화
// 파일은 결측치를 제거한 아래 파일로 운영함. 'cleaned_test2.csv'
d3.csv("cleaned_test2.csv").then(function(data) {
    createDropdown("#ckgMethod", uniqueValues(data, 'CKG_MTH_ACTO_NM'));
    createDropdown("#ckgSituation", uniqueValues(data, 'CKG_STA_ACTO_NM'));
    createDropdown("#ckgMaterial", uniqueValues(data, 'CKG_MTRL_ACTO_NM'));
    createDropdown("#ckgTime", uniqueValues(data, 'CKG_TIME_NM'));

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
    console.log(data);
    let method = d3.select("#ckgMethod").property("value");
    let situation = d3.select("#ckgSituation").property("value");
    let material = d3.select("#ckgMaterial").property("value");
    let time = d3.select("#ckgTime").property("value");

    let filteredData = data.filter(d => 
        (method === "" || d.CKG_MTH_ACTO_NM === method) &&
        (situation === "" || d.CKG_STA_ACTO_NM === situation) &&
        (material === "" || d.CKG_MTRL_ACTO_NM === material) &&
        (time === "" || d.CKG_TIME_NM === time)
    );
 
    let uniqueData = Array.from(new Map(filteredData.map(item => [item['CKG_NM'], item])).values());
    renderBarChart(getTop10(uniqueData, 'INQ_CNT'), 'INQ_CNT');
}


function getTop10(data, field) {
    return data.sort((a, b) => d3.descending(+a[field], +b[field])).slice(0, 10);
}

function renderBarChart(data, field) {
    d3.select("#barChart").selectAll("svg").remove();
    // SVG 설정
    const margin = {top: 20, right: 20, bottom: 60, left: 60};
    const width = 1200 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;
    const svgWidth = width + margin.left + margin.right;
    const svgHeight = height + margin.top + margin.bottom;
    const svg = d3.select("#barChart").append("svg")
        .attr("width", svgWidth)
        .attr("height", svgHeight)
        .style("background", "#f5f5f5")
        .style("border", "1px solid #ccc")
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // 제목 추가
    svg.append("text")
        .attr("x", (width / 2))             
        .attr("y", (margin.top / 2))
        .attr("text-anchor", "middle")  
        .style("font-size", "20px") 
        .style("text-decoration", "underline")  
        .text("조회수 기준 상위 10개 요리");

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
        .style("text-anchor", "middle");

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
            .attr("fill", (d, i) => d3.schemeCategory10[i % 10])
            .on("mouseover", function(event, d) {
                tooltip.transition().duration(200).style("opacity", .9);
                let xPosition = event.clientX + 20; 
                let yPosition = event.clientY + 20; 
            
                let tooltipWidth = tooltip.node().getBoundingClientRect().width;
                let tooltipHeight = tooltip.node().getBoundingClientRect().height;
            
                if (xPosition + tooltipWidth > window.innerWidth) {
                    xPosition -= tooltipWidth + 40;
                }
            
                if (yPosition + tooltipHeight > window.innerHeight) {
                    yPosition -= tooltipHeight + 40;
                }
                tooltip.html(`
                    <strong>요리명: ${d.CKG_NM}</strong><br/>
                    조회 수: ${d.INQ_CNT}<br/>
                    요리 방법: ${d.CKG_MTH_ACTO_NM}<br/>
                    주재료: ${d.CKG_MTRL_ACTO_NM}<br/>
                    요리 상황: ${d.CKG_STA_ACTO_NM}`
                )
                .style("left", xPosition + "px") 
                .style("top", yPosition + "px");
            })
            
            .on("mouseout", function(d) {
                tooltip.transition().duration(500).style("opacity", 0);
            })
            .transition()
            .duration(800)
            .attr("y", d => y(+d[field]))
            .attr("height", d => height - y(+d[field]));
}




