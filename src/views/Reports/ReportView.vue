<style scoped>
    .icons{
        font-size: 50px;
        margin-left: 80px;
        color: #7CAF50;
    }
    .iconss{
        font-size: 50px;
        margin-left: 80px;
    }
    .card{
        padding: 10px 20px;
    }
    .text-time{
        color: #7CAF50;
    }
    .fs-7{
        font-size: 18px;
    }
    .font-costume{
        font-family: 'Kantumruy Pro', 'Khmer OS', sans-serif !important;
    }
</style>
<template>
    <div class="font-costume">
        <h2 class="fw-bold">របាយការណ៍ និងការវិភាគ</h2>
        <p>ការយល់ដឹងលម្អិតអំពីសកម្មភាពហិរញ្ញវត្ថុរបស់អ្នក</p>
        <div class="d-flex">
            <button type="button" class="btn btn-outline-secondary rounded-4"><i class="bi bi-calendar"></i> ៦ ខែចុងក្រោយ</button>
            <button class="btn btn-primary ms-3 rounded-4" type="submit"><i class="bi bi-download"></i> ទាញយករបាយការណ៍</button>
        </div>
        <div class="row mt-5">
            <div class="col-3">
                <div class="card border-0 rounded-4 shadow">
                    <div class="d-flex">
                        <div>
                            <p class=" fs-7">
                                Avg. Monthly <br>
                                ប្រាក់ចំណូល
                            </p>
                        </div>
                        <div class="icons">
                            <i class="bi bi-graph-up-arrow"></i>
                        </div>
                    </div>
                    <h1>$5,273</h1>
                    <p class="text-time fw-bold">+4.2% ពីរយៈពេលចុងក្រោយ</p>
                </div>
            </div>
            <div class="col-3">
                <div class="card border-0 rounded-4 shadow">
                    <div class="d-flex">
                        <div>
                            <p class=" fs-7">
                                Avg. Monthly <br>
                                ប្រាក់ចំណាយ
                            </p>
                        </div>
                        <div class="iconss text-danger">
                            <i class="bi bi-graph-up-arrow"></i>
                        </div>
                    </div>
                    <h1>$3,273</h1>
                    <p class="text-danger fw-bold">+2.8% ពីរយៈពេលចុងក្រោយ</p>
                </div>
            </div>
            <div class="col-3">
                <div class="card border-0 rounded-4 shadow">
                    <div class="d-flex">
                        <div>
                            <p class=" fs-7">
                                Avg. Monthly <br>
                                ការសន្សំ
                            </p>
                        </div>
                        <div class="iconss text-info">
                            <i class="bi bi-graph-up-arrow"></i>
                        </div>
                    </div>
                    <h1>$5,273</h1>
                    <p class="text-time text-info fw-bold">+8.1% ពីរយៈពេលចុងក្រោយ</p>
                </div>
            </div>
            <div class="col-3">
                <div class="card border-0 rounded-4 shadow">
                    <div class="d-flex">
                        <div>
                            <p class=" fs-7">
                                អត្រាសន្សំ
                            </p>
                        </div>
                        <div class="icons">
                            <i class="bi bi-pie-chart-fill"></i>
                        </div>
                    </div>
                    <h1>30.8%</h1>
                    <p class="">នៃប្រាក់ចំណូលសរុប</p>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
</script>