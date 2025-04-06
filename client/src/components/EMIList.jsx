



import React from 'react';
import { ToggleLeft, ToggleRight } from 'lucide-react';

const EMIList = ({ emis, onToggleAutopay }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4">EMI Payments</h3>
      
      {emis.length === 0 ? (
        <p className="text-gray-500 text-center py-4">No EMIs to display</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-gray-500 border-b">
                <th className="pb-2 font-medium">Name</th>
                <th className="pb-2 font-medium">Amount</th>
                <th className="pb-2 font-medium">Next Payment</th>
                <th className="pb-2 font-medium">Progress</th>
                <th className="pb-2 font-medium">Autopay</th>
              </tr>
            </thead>
            <tbody>
              {emis.map((emi) => (
                <tr key={emi.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 text-sm font-medium">{emi.name}</td>
                  <td className="py-3 text-sm">₹{emi.amount.toFixed(2)}</td>
                  <td className="py-3 text-sm">{emi.nextPaymentDate}</td>
                  <td className="py-3 text-sm">
                    <div className="flex items-center">
                      <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                        <div 
                          className="bg-light-purple-500 h-2 rounded-full" 
                          style={{ width: `${((emi.totalPayments - emi.remainingPayments) / emi.totalPayments) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-500">
                        {emi.totalPayments - emi.remainingPayments}/{emi.totalPayments}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 text-sm">
                    <button 
                      onClick={() => onToggleAutopay(emi.id)}
                      className="flex items-center text-sm"
                    >
                      {emi.autopay ? (
                        <>
                          <ToggleRight className="h-5 w-5 text-light-purple-600 mr-1" />
                          <span className="text-light-purple-600">On</span>
                        </>
                      ) : (
                        <>
                          <ToggleLeft className="h-5 w-5 text-gray-400 mr-1" />
                          <span className="text-gray-500">Off</span>
                        </>
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default EMIList;