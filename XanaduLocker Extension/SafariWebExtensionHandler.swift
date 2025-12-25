//
//  SafariWebExtensionHandler.swift
//  XanaduLocker Extension
//
//  Created by Noah on 12/25/25.
//

import SafariServices
import os.log

class SafariWebExtensionHandler: NSObject, NSExtensionRequestHandling {
    private let suiteKeyStore = UserDefaults(suiteName: "group.com.noahsaso.XanaduLocker")!

    func beginRequest(with context: NSExtensionContext) {
        let request = context.inputItems.first as? NSExtensionItem

        let profile: UUID?
        if #available(iOS 17.0, macOS 14.0, *) {
            profile = request?.userInfo?[SFExtensionProfileKey] as? UUID
        } else {
            profile = request?.userInfo?["profile"] as? UUID
        }

        let message: Any?
        if #available(iOS 15.0, macOS 11.0, *) {
            message = request?.userInfo?[SFExtensionMessageKey]
        } else {
            message = request?.userInfo?["message"]
        }

        os_log(.default, "Received message from browser.runtime.sendNativeMessage: %@ (profile: %@)", String(describing: message), profile?.uuidString ?? "none")
        
        var responseContents: [String: String]?
        if let dict = message as? [String: String] {
            if let req = dict["request"] {
                if req == "code" {
                    if let code = suiteKeyStore.string(forKey: "code") {
                        responseContents = ["code": code]
                    }
                }
            }
        }
        
        if responseContents == nil {
            responseContents = ["error": "Unknown request"]
        }

        let response = NSExtensionItem()
        if #available(iOS 15.0, macOS 11.0, *) {
            response.userInfo = [ SFExtensionMessageKey: responseContents! ]
        } else {
            response.userInfo = [ "message": responseContents! ]
        }

        context.completeRequest(returningItems: [ response ], completionHandler: nil)
    }

}
