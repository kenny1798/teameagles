import React, { useEffect } from 'react';
import { useLogout } from '../../hooks/useLogout';

function AccAuthPage() {

  const {logout} = useLogout();

  useEffect(() => {

    const delay = () => {
      logout()
    }
    setTimeout(delay, 2000)
  }, [])


  return (
            <div className="row justify-content-center text-center">
              <div className="col-sm-8">
            <div class="alert alert-info" role="alert">
            <h2 className="mt-4 font-weight-bold-display-4">Your account is pending for approval</h2>
          
                </div>
                </div>
                </div>
        )}

export default AccAuthPage