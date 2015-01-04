/**
 * Created by wangjiewen on 14-12-30.
 */

var Matrix = {

    init: function () {
        var self = this;
        var pointList = [
            [-1, 0],
            [5, 0],
            [0, -5]
        ];

        var matrix = self.buildAugMatrix(pointList, 3);
        var alpha = self.solve(matrix);
        var top = 0;

        var a = alpha[0];
        var b = alpha[1];
        var c = alpha[2] - top;
        var delta = b*b - 4*a*c;
        var x1 = (-b + Math.sqrt(delta)) / (2 * a);
        var x2 = (-b - Math.sqrt(delta)) / (2 * a);
        debugger
    },

    /**
     * 构建增广矩阵
     * @param pointList 点的个数
     * @param n 未知数的个数
     * @return {Array} matrix
     */
    buildAugMatrix: function (pointList, n) {
        var pLen = pointList.length;
        var matrix = [];
        for(var i = 0; i < pLen; i++){
            var tmp = [];
            for(var k = n - 1; k >= 0; k--){
                tmp.push(Math.pow(pointList[i][0], k));
            }
            tmp.push(pointList[i][1]);
            matrix.push(tmp);
        }
        return matrix;
    },

    /**
     * 通过矩阵解多元一次线性方程
     * @param m 增广矩阵
     * @returns {Array} 系数的值
     */
    solve: function (m) {
        var self = this;
        //从左至右, 逐列处理选第1列中一个非零元,用它将第1列其余元素化为0,
        //再此行交换到第1行第1行第1列就不再动了继续第2列
        var col = m[0].length;
        var row = m.length;
        var lastNoneZeroRow = 0;//上一次的非0行
        var fistNoneZeroRow = -1;//当前列的第一个非0元素所在行
        for(var j = 0; j < col; j++){
            fistNoneZeroRow = self.selectRow(m, lastNoneZeroRow, j);
            if(fistNoneZeroRow == -1){
                continue;
            }
            for(var i = 0; i < row; i++){
                if(i == fistNoneZeroRow){
                    continue;
                }

                //每一行的比率
                var ratio = m[i][j] / m[fistNoneZeroRow][j];
                if(ratio == 0){
                    continue;
                }
                for(var k = j; k < col; k++){
                    m[i][k] -= ratio * m[fistNoneZeroRow][k];
                    if(Math.abs(m[i][k]) < 0.000001){
                        m[i][k] = 0;
                    }
                }
            }

            if(lastNoneZeroRow != fistNoneZeroRow){
                self.swap(m, fistNoneZeroRow, lastNoneZeroRow);
            }
            lastNoneZeroRow++;

        }

        var alpha = [];
        for(i = 0; i < row; i++){
            for(j = 0; j < col; j++){
                //因为js float不精确
                if(m[i][j] != 0 && Math.abs(m[i][j]) >= 0.000001){
                    alpha.push(m[i][col - 1] / m[i][j]);
                    break;
                }
            }
        }
        return alpha;
    },

    selectRow: function (matrix, lastNoneZeroRow,  j) {
        var len = matrix.length;
        for(var i = lastNoneZeroRow; i < len; i++){
            if(matrix[i][j] != 0){
                return i;
            }
        }
        return -1;
    },

    swap: function (matrix, i, j) {
        var len = matrix[0].length;
        for(var k = 0; k < len; k++){
            var t = matrix[i][k];
            matrix[i][k] = matrix[j][k];
            matrix[j][k] = t;
        }
    }
}