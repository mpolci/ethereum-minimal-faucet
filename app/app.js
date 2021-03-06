
if (!ethereumRpc) {
  window.ethereumRpc = 'http://localhost:8545'
}

if (!web3) {
  window.web3 = new Web3(new Web3.providers.HttpProvider(ethereumRpc))
}

angular.module('faucetApp', [])
.controller('FaucetController', function ($scope) {
  var self = this
  angular.extend(this, {
    accounts: [],
    destinationAddressInput: '',
    ethMessage: null,
    tokenName: '',
    tokenSymbol: '',
    tokenTotalSupply: web3.toBigNumber(1000),
    tokenDecimals: 0,
    tokMessage: null,

    cmdSendEth: cmdSendEth,
    cmdDeployToken: cmdDeployToken,
  })

  web3.eth.getAccounts(function (err, accounts) {
    if (err) return console.error(err)
    self.accounts = accounts
    console.log(accounts)
    $scope.$apply()
  })

  /*********************************************************/

  function cmdSendEth () {
    var from = self.accounts[Math.floor(Math.random() * self.accounts.length)]
    var value =  web3.toWei(Math.random() + 0.5)
    web3.eth.sendTransaction({
      from: from,
      to: self.destinationAddressInput,
      value: value,
      // gas: 500000
    }, function (err, txid) {
      if (err) {
        console.error(err)
        self.ethMessage = err.toString()
      } else {
        var msg = 'new transaction: ' + txid
        console.log(msg)
        self.ethMessage = msg
      }
      $scope.$apply()
    })
  }

  var abi = '[{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"success","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"success","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"standard","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"},{"name":"_extraData","type":"bytes"}],"name":"approveAndCall","outputs":[{"name":"success","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"inputs":[{"name":"initialSupply","type":"uint256"},{"name":"tokenName","type":"string"},{"name":"decimalUnits","type":"uint8"},{"name":"tokenSymbol","type":"string"}],"payable":false,"type":"constructor"},{"payable":false,"type":"fallback"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"}]'
  var bin = '60a0604052600960608190527f546f6b656e20302e3100000000000000000000000000000000000000000000006080908152600080548180527f546f6b656e20302e310000000000000000000000000000000000000000000012825590927f290decd9548b62a8d60345a988386fc84ba6bc95484008f6362f93160ef3e563602060026001851615610100026000190190941693909304601f01929092048201929091906100d5565b828001600101855582156100d5579182015b828111156100d55782518255916020019190600101906100ba565b5b506100f69291505b808211156100f257600081556001016100de565b5090565b50503461000057604051610bc9380380610bc9833981016040908152815160208301519183015160608401519193928301929091015b33600160a060020a031660009081526005602090815260408220869055600486905584516001805493819052927fb10e2d527612073b26eecdfd717e6a320cf44b4afac2b0732d9fcbe2b7fa0cf6600282861615610100026000190190921691909104601f9081018490048201938801908390106101b557805160ff19168380011785556101e2565b828001600101855582156101e2579182015b828111156101e25782518255916020019190600101906101c7565b5b506102039291505b808211156100f257600081556001016100de565b5090565b50508060029080519060200190828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f1061025157805160ff191683800117855561027e565b8280016001018555821561027e579182015b8281111561027e578251825591602001919060010190610263565b5b5061029f9291505b808211156100f257600081556001016100de565b5090565b50506003805460ff191660ff84161790555b505050505b610904806102c56000396000f300606060405236156100935763ffffffff60e060020a60003504166306fdde0381146100a5578063095ea7b31461013257806318160ddd1461016257806323b872dd14610181578063313ce567146101b75780635a3b7e42146101da57806370a082311461026757806395d89b4114610292578063a9059cbb1461031f578063cae9ca511461033d578063dd62ed3e146103b1575b34610000576100a35b610000565b565b005b34610000576100b26103e2565b6040805160208082528351818301528351919283929083019185019080838382156100f8575b8051825260208311156100f857601f1990920191602091820191016100d8565b505050905090810190601f1680156101245780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b346100005761014e600160a060020a036004351660243561046f565b604080519115158252519081900360200190f35b346100005761016f6104a2565b60408051918252519081900360200190f35b346100005761014e600160a060020a03600435811690602435166044356104a8565b604080519115158252519081900360200190f35b34610000576101c46105b4565b6040805160ff9092168252519081900360200190f35b34610000576100b26105bd565b6040805160208082528351818301528351919283929083019185019080838382156100f8575b8051825260208311156100f857601f1990920191602091820191016100d8565b505050905090810190601f1680156101245780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b346100005761016f600160a060020a036004351661064b565b60408051918252519081900360200190f35b34610000576100b261065d565b6040805160208082528351818301528351919283929083019185019080838382156100f8575b8051825260208311156100f857601f1990920191602091820191016100d8565b505050905090810190601f1680156101245780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b34610000576100a3600160a060020a03600435166024356106e8565b005b3461000057604080516020600460443581810135601f810184900484028501840190955284845261014e948235600160a060020a03169460248035956064949293919092019181908401838280828437509496506107a195505050505050565b604080519115158252519081900360200190f35b346100005761016f600160a060020a03600435811690602435166108bb565b60408051918252519081900360200190f35b60018054604080516020600284861615610100026000190190941693909304601f810184900484028201840190925281815292918301828280156104675780601f1061043c57610100808354040283529160200191610467565b820191906000526020600020905b81548152906001019060200180831161044a57829003601f168201915b505050505081565b600160a060020a0333811660009081526006602090815260408083209386168352929052208190556001825b5092915050565b60045481565b600160a060020a038316600090815260056020526040812054829010156104ce57610000565b600160a060020a03831660009081526005602052604090205482810110156104f557610000565b600160a060020a038085166000908152600660209081526040808320339094168352929052205482111561052857610000565b600160a060020a03808516600081815260056020908152604080832080548890039055878516808452818420805489019055848452600683528184203390961684529482529182902080548790039055815186815291517fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef9281900390910190a35060015b9392505050565b60035460ff1681565b6000805460408051602060026001851615610100026000190190941693909304601f810184900484028201840190925281815292918301828280156104675780601f1061043c57610100808354040283529160200191610467565b820191906000526020600020905b81548152906001019060200180831161044a57829003601f168201915b505050505081565b60056020526000908152604090205481565b6002805460408051602060018416156101000260001901909316849004601f810184900484028201840190925281815292918301828280156104675780601f1061043c57610100808354040283529160200191610467565b820191906000526020600020905b81548152906001019060200180831161044a57829003601f168201915b505050505081565b600160a060020a0333166000908152600560205260409020548190101561070e57610000565b600160a060020a038216600090815260056020526040902054818101101561073557610000565b600160a060020a03338116600081815260056020908152604080832080548790039055938616808352918490208054860190558351858152935191937fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef929081900390910190a35b5050565b6000836107ae818561046f565b156108b25780600160a060020a0316638f4ffcb1338630876040518563ffffffff1660e060020a0281526004018085600160a060020a0316600160a060020a0316815260200184815260200183600160a060020a0316600160a060020a0316815260200180602001828103825283818151815260200191508051906020019080838360008314610859575b80518252602083111561085957601f199092019160209182019101610839565b505050905090810190601f1680156108855780820380516001836020036101000a031916815260200191505b5095505050505050600060405180830381600087803b156100005760325a03f11561000057505050600191505b5b509392505050565b6006602090815260009283526040808420909152908252902054815600a165627a7a72305820f786bdbadda4829da098d2d0887e305241654b04c2497a40f574b7cfd77bd9490029'

  function cmdDeployToken () {
    self.tokMessage = ''
    var tokenContract = web3.eth.contract(JSON.parse(abi))
    var from = self.accounts[Math.floor(Math.random() * self.accounts.length)]

    function _err (err) {
      console.error(err)
      self.tokMessage = err.toString()
      $scope.$apply()
    }

    function waitContract (txid, cb) {
      web3.eth.getTransactionReceipt(txid, function (err, receipt) {
        if (err) {
          _err(err)
        } else {
          if (receipt && receipt.contractAddress) {
            cb(receipt.contractAddress)
          } else {
            setTimeout(waitContract, 1000, txid, cb)
          }
        }
      })
    }

    var createData = tokenContract.new.getData(
      self.tokenTotalSupply,
      self.tokenName,
      self.tokenDecimals,
      self.tokenSymbol,
      {data: bin})
    if (createData.substr(0,2) !== '0x') {
      createData = '0x' + createData
    }

    web3.eth.sendTransaction(
      { from: from, data: createData, gas: 4000000 },
      function (err, txHash) {
        if (err) {
          _err(err)
        } else {
          var msg = 'waiting contract creation: ' + txHash
          console.log(msg)
          self.tokMessage = msg
          $scope.$apply()
          waitContract(txHash, function (contractAddress) {
            console.log('created token at address', contractAddress)
            var token = tokenContract.at(contractAddress)

            var data = token.transfer.getData(self.destinationAddressInput, self.tokenTotalSupply)
            web3.eth.sendTransaction(
              { from: from, to: token.address, data: data, gas: 300000 },
              function (err, txid) {
                if (err) {
                  _err(err)
                } else {
                  var msg = 'new transaction for token transfer: ' + txid
                  console.log(msg)
                  self.tokMessage = msg
                  $scope.$apply()
                }
              }
            )
          })
        }
      }
    )
  }

})

.directive('bigNumber', function () {
  return {
    restrict: 'A',
    require: 'ngModel',
    link: function(scope, element, attrs, modelCtrl) {
      var decimals = null

      attrs.$observe('decimals', function(value) {
        var intVal = parseInt(value)
        decimals = isNaN(intVal) || value < 0 ? null : intVal
      })

      function format(modelValue) {
        if (modelValue == null) return modelValue
        var num = decimals != null
          ? modelValue.shift(-decimals)
          : modelValue
        return num.toString()
      }

      modelCtrl.$parsers.push(function (inputValue) {
        if (inputValue == null || inputValue === '') return null
        var allowedDot = decimals == null || decimals !== 0
        var lastCharIsDot = inputValue.slice(-1) === '.'
        var transformedInput
        try {
          transformedInput = web3.toBigNumber(inputValue)
          if (decimals != null) {
            transformedInput = transformedInput.shift(decimals).truncated()
          }
        } catch (e) {
          // restore previous value
          transformedInput = modelCtrl.$modelValue
        }
        var newViewValue = format(transformedInput)
        if (newViewValue !== inputValue &&
          (!lastCharIsDot || !allowedDot)) {
          modelCtrl.$viewValue = newViewValue
          modelCtrl.$render()
        }
        return transformedInput
      })

      modelCtrl.$formatters.unshift(format)
    }
  }
})