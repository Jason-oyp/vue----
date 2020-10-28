function getNamespace(nowNamespace, nowProp) {
    if (nowNamespace == '') {
        return nowProp;
    } else {
        return `${nowNamespace}.${nowProp}`
    }
}



// 对数组的各种方法进行代理
function constructorArr(vm, arr, namespace) {
    const arrPrototypes = Array.prototype;
    let obj = {};
    const arrLists = ['push', 'pop', 'shift', 'unshift', 'slice', 'splice'];
    for (let i = 0; i < arrLists.length; i++) {
        Object.defineProperty(obj, arrLists[i], {
            configurable: true,
            enumerable: true,
            value(...args) {
                return arrPrototypes['push'].apply(this, args);
            }
        });
    }
    arr.__proto__ = obj;
    return arr;
}

// 对对象的代理
function constructorObj(vm, obj, namespace) {
    let proxyObj = {};
    for (const prop in obj) {
        Object.defineProperty(proxyObj, prop, {
            configurable: true,
            get() {
                return obj[prop];
            },
            set(val) {
                console.log(getNamespace(namespace,prop));
                obj[prop] = val;
            }
        });
        Object.defineProperty(vm, prop, {
            configurable: true,
            get() {
                return obj[prop];
            },
            set(val) {
                console.log(getNamespace(namespace,prop));
                obj[prop] = val;
            }
        });
        if (typeof obj[prop] === 'object') {
            proxyObj[prop] = constructorProxy(vm, obj[prop], getNamespace(namespace, prop));
        }
    }
    return proxyObj;
}


// 递归对options.data进行代理
export function constructorProxy(vm, obj, namespace) {
    let proxyObj = null;
    if (Object.prototype.toString.call(obj) === '[object Array]') {
        // 
        // for (let i; i < obj.length; i++) {
        //     const proxyObj = new Array(obj.length);
        //     proxyObj[i] = constructorProxy(vm, obj[i], namespace);
        // }
        proxyObj = constructorArr(vm, obj, namespace);
        for (let i = 0; i < obj.length; i++) {
            proxyObj[i] = constructorProxy(vm, obj[i], namespace);
        }
    } else if (Object.prototype.toString.call(obj) === '[object Object]') {
        proxyObj = constructorObj(vm, obj, namespace);
    } else {
        // throw new Error(`${typeof obj}`);
        return obj;
    }
    return proxyObj;
}